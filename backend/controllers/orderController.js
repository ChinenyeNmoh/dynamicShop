import Order from '../models/orderModel.js';
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Cart from '../models/cartModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { sendEmail, processOrderEmailTemplate } from '../utils/mail.js';
import Flutterwave from 'flutterwave-node-v3';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const flw = new Flutterwave(process.env.PUBLIC_KEY, process.env.SECRET_KEY);

const checkOut = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  let payload = {};

  try {
    const userCart = await Cart.findOne({ orderedby: _id });
    if (!userCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    await userCart.populate([
      { path: 'products.productId' },
      { path: 'shippingAddress' }
    ]);

    const billingOwner = await User.findById(_id);
    const firstname = billingOwner?.local.firstname || billingOwner.google.firstname || billingOwner.facebook.firstname;
    const lastname = billingOwner?.local.lastname || billingOwner.google.lastname || billingOwner.facebook.lastname;
    const email = billingOwner?.local.email || billingOwner.google.email || billingOwner.facebook.email;
    const phoneNo = billingOwner?.local.mobile || "";
    
    let newOrder = {};
    let myOrder;

    if (userCart.paymentMethod === "cashOnDelivery") {
      newOrder = {
        user: _id,
        products: userCart.products.map(item => ({
              productId: item.productId._id,
              quantity: item.quantity,
              price: item.price,
            })),
        shippingAddress: userCart.shippingAddress,
        cartTotal: userCart.cartTotal,
        totalPrice: userCart.totalPrice,
        taxFee: userCart.taxFee,
        totalAfterCoupon: userCart.totalAfterCoupon,
        shippingFee: userCart.shippingFee,
        paymentMethod: userCart.paymentMethod,
      };
      myOrder = await Order.create(newOrder);
      await myOrder.populate([
        { path: 'products.productId' },
        { path: 'shippingAddress' },
        { path: 'user', select: '-password -updatedAt -__v' }
      ]);

      const htmlContent = processOrderEmailTemplate(myOrder, firstname, lastname, email, phoneNo);
      await sendEmail(email, 'Order confirmation', htmlContent);
    } else if (userCart.paymentMethod === 'flutterwave') {
      const [month, year] = req.body.expiryDate.split('/');
      payload = {
        card_number: req.body.cardNumber,
        cvv: req.body.cvv,
        expiry_month: month,
        expiry_year: year,
        fullname: req.body.cardName,
        currency: 'NGN',
        amount: userCart.totalPrice,
        redirect_url: 'http://localhost:3000/',
        email: email,
        phone_number: phoneNo || '',
        enckey: process.env.ENCRYPTION_KEY,
        tx_ref: uuidv4()
      };

      const response = await flw.Charge.card(payload);
      console.log('response from payload',response);

      if (response.meta.authorization.mode === 'pin') {
        let payload2 = payload;
        payload2.authorization = {
          mode: 'pin',
          pin: 3310
        };

        const reCallCharge = await new Promise((resolve, reject) => {
          flw.Charge.card(payload2)
            .then(response => {
              resolve(response);
            })
            .catch(error => {
              reject(error);
            });
        });
        console.log("recharge", reCallCharge);

        const callValidate = await flw.Charge.validate({
          otp: "12345",
          flw_ref: reCallCharge.data.flw_ref
        });
        console.log("callVal", callValidate);

        if (callValidate.status === 'success') {
          newOrder = {
            user: _id,
            products: userCart.products.map(item => ({
              productId: item.productId._id,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress: userCart.shippingAddress,
            cartTotal: userCart.cartTotal,
            totalPrice: userCart.totalPrice,
            taxFee: userCart.taxFee,
            totalAfterCoupon: userCart.totalAfterCoupon,
            shippingFee: userCart.shippingFee,
            paymentMethod: userCart.paymentMethod,
            paymentStatus: "paid",
            paidAt: Date.now(),
          };
          myOrder = await Order.create(newOrder);
          await myOrder.populate([
            { path: 'products.productId' },
            { path: 'shippingAddress' },
            { path: 'user', select: '-password -updatedAt -__v' },
          ]);
          const htmlContent = processOrderEmailTemplate(myOrder, firstname, lastname, email, phoneNo);
          await sendEmail(email, 'Order confirmation', htmlContent);
        } else {
          return res.status(400).json({ message: "Failed to process payment" });
        }
      } else if (response.meta.authorization.mode === 'redirect') {
        const url = response.meta.authorization.redirect;
        console.log(url);
        return res.redirect(url);
      }
    }

    if (myOrder) {
      const update = myOrder.products.map((item) => {
        return {
          updateOne: {
            filter: { _id: item.productId },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
          },
        };
      });
      await Product.bulkWrite(update, {});
      await Cart.findByIdAndDelete(userCart._id);
      res.status(200).json({ message: 'Order placed successfully', order: myOrder });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get all orders
const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const orders = await Order.find({ user: _id }).sort({ createdAt: -1 });
    if (!orders.length) {
      return res.status(404).json({ error: "Orders not found" });
    }
    await Order.populate(orders, [
      { path: 'products.productId' },
      { path: 'shippingAddress' },
      { path: 'user', select: '-password -updatedAt -__v' },
    ]);
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get Order by Id

const getOrderById = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  try {
    const order = await Order.findOne({ user: _id, _id: id }).populate([
      { path: 'products.productId'}, {path: 'shippingAddress'}, {path: 'user', select: '-password -updatedAt -__v'},
    ]);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({
      message: 'Order fetched successfully',
      order,
    });
  } catch (err) {
    console.error(err);
  }
});

export {checkOut, getOrders, getOrderById}