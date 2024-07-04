import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';
import Address from '../models/addressModel.js';

const reCalCart = (cart) => {
  cart.cartTotal = cart.products.reduce((acc, prod) => acc + (prod.price * prod.quantity), 0);
  cart.shippingFee = cart.cartTotal > 50000 ? 0 : 10;
  cart.taxFee = Number(0.15 * cart.cartTotal);
  cart.totalPrice = (
    Number(cart.cartTotal) +
    Number(cart.shippingFee) +
    Number(cart.taxFee)
  ).toFixed(2);
  cart.totalAfterCoupon = 0; // Reset coupon total after updating cart
  return cart;
};

const createCart = asyncHandler(async (req, res) => {
  const { id: cartItemId } = req.body;
  const qty = Number(req.body.qty);
  const { _id: userId } = req.user;

  // Retrieve the product details
  const product = await Product.findById(cartItemId);

  // Check if the product exists
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Check if the product is in stock
  if (product.quantity < qty) {
    return res.status(400).json({ error: `Sorry, only ${product.quantity} units of ${product.name} are available in stock` });
  }

  // Calculate product price
  const productPrice = product.discountedPrice !== 0 ? product.discountedPrice : product.price;

  // Check if there is already a cart associated with the user
  let cart = await Cart.findOne({ orderedby: userId });

  if (!cart) {
    // If no cart exists, create a new one
    const productTotalPrice = productPrice * qty;
    const taxFee = Number(0.15 * productTotalPrice);
    const shippingFee = productTotalPrice > 50000 ? 0 : 10;

    cart = new Cart({
      products: [{
        productId: product._id,
        quantity: qty,
        price: productPrice,
      }],
      cartTotal: productTotalPrice,
      shippingFee: shippingFee,
      taxFee: taxFee,
      totalPrice: (
        Number(productTotalPrice) +
        Number(shippingFee) +
        Number(taxFee)
      ).toFixed(2),
      orderedby: userId,
    });

    await cart.save();
    await cart.populate({ path: 'products.productId', select: '-updatedAt -__v' });
    return res.status(201).json({
      message: 'Product added to cart',
      cart,
    });
  } else {
    // If cart exists, check if the product is already added
    const productExists = cart.products.find(prod => prod.productId.equals(cartItemId));

    if (productExists) {
      // If the product is already in the cart, update the quantity and recalculate totals
      productExists.quantity = qty;
      cart = reCalCart(cart);
    } else {
      // Add the product to the existing cart
      cart.products.push({
        productId: cartItemId,
        quantity: qty,
        price: productPrice,
      });
      cart = reCalCart(cart);
    }

    await cart.save();
    await cart.populate({ path: 'products.productId', select: '-updatedAt -__v' });
    return res.status(201).json({
      message: 'Cart Updated',
      cart,
    });
  }
});

// Get cart
const getCart = asyncHandler(async (req, res) => {
  console.log('controll came to backend')
  const { _id } = req.user;
    const userCart = await Cart.findOne({ orderedby: _id })
    if (!userCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }else{
      console.log(userCart)
      await userCart.populate({ path: 'products.productId', select: '-updatedAt -__v' })
      return res.status(200).json({
        cart: userCart
      });
    }
  
});

//remove item from cart
const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params; // id of the product to remove
  const { _id } = req.user; // id of the user
  const cart = await Cart.findOne({ orderedby: _id });
  
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  
  const productIndex = cart.products.findIndex(prod => prod.productId.equals(id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found in cart' });
  }
  
  const [product] = cart.products.splice(productIndex, 1);
  
  cart.cartTotal = cart.products.reduce((acc, prod) => acc + (prod.price * prod.quantity), 0); // Recalculate cart total
  cart.shippingFee = cart.cartTotal > 50000 ? 0 : 10;
  cart.totalAfterCoupon = 0; // Reset coupon total after updating cart
  cart.taxFee = Number(0.15 * cart.cartTotal);
  cart.totalPrice = (
    Number( cart.cartTotal) +
    Number(cart.shippingFee) +
    Number(cart.taxFee)
  ).toFixed(2);
  
  await cart.save();
  await cart.populate({ path: 'products.productId', select: '-updatedAt -__v' });
  
  return res.status(200).json({
    message: 'Product removed from cart',
    cart
  });
});

 
//empty cart
const emptyCart = async(req, res) => {
const { _id } = req.user;
  const alreadyExistCart = await Cart.findOne({ orderedby: _id });
  console.log(alreadyExistCart)
  if (alreadyExistCart) {
    await Cart.findByIdAndDelete(alreadyExistCart._id)
   res.status(200).json({ message: 'Cart deleted' });
  }else{
    res.status(404).json({ error: 'Cart not found' });
  }
}


//update cart
const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  console.log('req.body',req.body)

  try {
    let findCart = await Cart.findOne({ orderedby: _id });
    if (!findCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const address = await Address.findOne({ user: _id });
    if (!address) {
      console.log('Shipping address not found for user:', _id);
      return res.status(404).json({ error: 'Shipping Address not found' });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { orderedby: _id },
      { 
        paymentMethod: req.body.paymentMethod || findCart.paymentMethod,
        shippingAddress: address._id 
      },
      { new: true }
    );

    return res.status(200).json({
      message: 'Payment method  updated successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//apply Coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  console.log('coupon',coupon)
  const { _id } = req.user;

  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) {
      return res.status(404).json({ error: 'Invalid coupon' });
    }

    let cartSum = await Cart.findOne({ orderedby: _id })
    if (!cartSum) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const removedPrice = ((cartSum.cartTotal * validCoupon.discount) / 100).toFixed(2); // Calculate removedPrice and round it to two decimal places for display
    const totalAfterCoupon = cartSum.cartTotal - parseFloat(removedPrice); // Use parseFloat to ensure correct subtraction
    const totalPrice = (
      Number(totalAfterCoupon) +
      Number(cartSum.shippingFee) +
      Number(cartSum.taxFee)
    ).toFixed(2);

    const newCart = await Cart.findOneAndUpdate(
      { orderedby: _id },
      { totalAfterCoupon, totalPrice },
      { new: true }
    );
    await newCart.populate({ path: 'products.productId', select: '-updatedAt -__v' });
    return res.status(200).json({
      message: 'Coupon applied successfully',
      cart: newCart
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export  { createCart, getCart, deleteItem, emptyCart, updateCart, applyCoupon};
