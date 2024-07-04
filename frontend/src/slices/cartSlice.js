import { createSlice,  createAsyncThunk} from '@reduxjs/toolkit';
import { updateCart} from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress:{}, paymentMethod:"cashOnDelivery" };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cartItems = action.payload.cart.products;
      console.log('state.cartitem',state.cartItems);
      return updateCart(state, action.payload);
    },
    removeCart: (state, action) => {
      state.cartItems = action.payload.cart.products;
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
      return updateCart(state, action.payload);
    },
    emptyCart: (state) => {
      localStorage.removeItem('cart');
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = "cashOnDelivery";
      state.TaxFee = 0;
      state.shippingFee = 0;
      state.totalPrice = 0;
      state.totalAfterCoupon = 0;
      return (state);
  },
  
  // NOTE: here we need to reset state for when a user logs out so the next
    // user doesn't inherit the previous users cart and shipping
    resetCart: (state) => (state = initialState),


    //save shipping address
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    //save payment method
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
   
  },
});

export const { addToCart, removeCart, emptyCart, resetCart , saveShippingAddress, savePaymentMethod} = cartSlice.actions;

export default cartSlice.reducer;

  