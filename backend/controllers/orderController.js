import Order from '../models/orderModel.js';
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Cart from '../models/cartModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { sendEmail, processOrderEmailTemplate, deliveredOrderEmailTemplate } from '../utils/mail.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';
import Flutterwave from 'flutterwave-node-v3';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const flw = new Flutterwave(process.env.PUBLIC_KEY, process.env.SECRET_KEY);

const checkOut = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { getCartID } = req.body;
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

    // double check no item is out of stock before checkout
    const outOfStockItems = userCart.products.filter(item => item.productId.quantity === 0);
    if (outOfStockItems.length > 0) {
      return res.status(400).json({ error: `${outOfStockItems[0].productId.name} is out of stock. Remove from cart to proceed` });
    }

    

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
      if(!req.body.cardNumber || !req.body.cvv || !req.body.expiryDate || !req.body.cardName){
        return res.status(400).json({ error: 'All fields are required for payment' });
      }
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
    }else if(getCartID){
      console.log('getCartID', getCartID);
      const { verified, value } = await verifyPayPalPayment(req.body.id);
      if (!verified) throw new Error('Payment not verified');

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error('Transaction has been used before');
  if(value !== userCart.totalPrice.toFixed(2)) throw new Error('Invalid payment amount');

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
        paymentResult : {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.payer.email_address,
        }
      };
      myOrder = await Order.create(newOrder);
      await myOrder.populate([
        { path: 'products.productId' },
        { path: 'shippingAddress' },
        { path: 'user', select: '-password -updatedAt -__v' }
      ]);
      const htmlContent = processOrderEmailTemplate(myOrder, firstname, lastname, email, phoneNo);
      await sendEmail(email, 'Order confirmation', htmlContent);

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

// Get user's orders
const myOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    if (!orders.length) {
      return res.status(404).json({ error: "No Order found" });
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

// Get a user's orders (Admin route)
const userOrders = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.find({ user: id }).populate([
      { path: 'products.productId' },
      { path: 'shippingAddress' },
      { path: 'user', select: '-password -updatedAt -__v' },
    ]);
    if (!orders.length) {
      return res.status(404).json({ error: "User has no orders" });
    }
    res.status(200).json({
      message: 'Orders fetched successfully',
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//admin route
const allOrders = asyncHandler(async (req, res) => {
  const { paymentStatus, orderStatus, keyword } = req.query;
  console.log(keyword);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;

  try {
    // Build the query object based on the provided parameters
    let query = {};
    let count;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (orderStatus) query.orderStatus = orderStatus;

    // Fetch orders based on the query
    let orders = await Order.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate([
        { path: 'products.productId' },
        { path: 'shippingAddress' },
        { path: 'user', select: '-password -updatedAt -__v' }
      ])
      .sort({ createdAt: -1 });

    // If a keyword is provided, filter the populated orders
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      orders = orders.filter(order =>
        order.user?.local?.firstname?.toLowerCase().includes(lowerKeyword)
        || order.user?.local?.lastname?.toLowerCase().includes(lowerKeyword)
        || order.user?.local?.email?.toLowerCase().includes(lowerKeyword)
        || order.user?.google?.firstname?.toLowerCase().includes(lowerKeyword)
        || order.user?.google?.lastname?.toLowerCase().includes(lowerKeyword)
        || order.user?.google?.email?.toLowerCase().includes(lowerKeyword)
        || order.user?.facebook?.firstname?.toLowerCase().includes(lowerKeyword)
        || order.user?.facebook?.lastname?.toLowerCase().includes(lowerKeyword)
        || order.user?.facebook?.email?.toLowerCase().includes(lowerKeyword)
      );
      count = orders.length;
      

    }else{
       // Count the total number of documents matching the query
    count = await Order.countDocuments(query);
    }
    console.log(count);

    if (count === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json({
      message: 'Orders fetched successfully',
      totalPages: Math.ceil(count / limit),
      page,
      totalCount: count,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get order by id
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ _id: id }).populate([
      { path: 'products.productId' },
      { path: 'shippingAddress' },
      { path: 'user', select: '-password -updatedAt -__v' },
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//delete order
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update order status to delivered
const confirmDelivery = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findById(id).populate([
      {path: 'products.productId'},
      {path:'shippingAddress'},
      {path: 'user', select: '-password -updatedAt -__v'}
    ]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.orderStatus = "delivered";
    if (order.paymentMethod === 'cashOnDelivery') {
      order.paymentStatus = "paid";
      order.paidAt = new Date();
    }
    order.deliveredAt = new Date();
    await order.save();
    const billingOwner = await User.findById(order.user);
    const firstname = billingOwner?.local.firstname || billingOwner.google.firstname || billingOwner.facebook.firstname;
    const lastname = billingOwner?.local.lastname || billingOwner.google.lastname || billingOwner.facebook.lastname;
    const email = billingOwner?.local.email || billingOwner.google.email || billingOwner.facebook.email;
    const phoneNo = billingOwner?.local.mobile || "";
    const htmlContent = deliveredOrderEmailTemplate(order, firstname, lastname, email, phoneNo);
    await sendEmail(email, 'Order delivery confirmation', htmlContent);


    res.status(200).json({ 
      message: 'Order status updated to delivered',
      order: order
     });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export {
  checkOut,
  getOrderById, 
  myOrders, 
  userOrders, 
  confirmDelivery, 
  allOrders,
  deleteOrder,
 };