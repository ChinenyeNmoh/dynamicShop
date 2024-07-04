export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state, payload) => {
  // Calculate the items price
  state.cartTotal = addDecimals(payload.cart.cartTotal);
  
  // Calculate the shipping price
  state.shippingFee = addDecimals(payload.cart.shippingFee);

  // Calculate the tax price
  state.taxFee = addDecimals(payload.cart.taxFee);

  // Calculate the total price
  state.totalAfterCoupon = payload.cart.totalAfterCoupon;
  state.totalPrice = payload.cart.totalPrice;

  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));
  return state;
};
