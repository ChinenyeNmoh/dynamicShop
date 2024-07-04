import { apiSlice } from './apiSlice';
import { CARTS_URL } from "../constants";
import { COUPON_URL } from '../constants';
import { applyCoupon } from '../../../backend/controllers/cartController';

export const cartSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCart: builder.mutation({
      query: (data) => ({
        url: `${CARTS_URL}/`,
        method: 'POST',
        body: data,
      }),
    }),
    getCart: builder.mutation({
      query: () => ({
        url: `${CARTS_URL}/`,
      }),
    }),
    delItem: builder.mutation({
        query: (id) => ({
          url: `${CARTS_URL}/${id}`,
          method: 'DELETE',
        }),
      }),
      emptyCart: builder.mutation({
        query: () => ({
          url: `${CARTS_URL}/`,
          method: 'DELETE',
        }),
      }),
      updateCart: builder.mutation({
        query: (paymentMethod) => ({
          url: `${CARTS_URL}/`,
          method: 'PUT',
          body: paymentMethod,
        }),
      }),
      applyCoupon: builder.mutation({
        query: (coupon) => ({
          url: `${CARTS_URL}/applycoupon`,
          method: 'POST',
          body: coupon,
        }),
      }),
  }),
});

export const { useCreateCartMutation, useGetCartMutation, useDelItemMutation, useEmptyCartMutation, useApplyCouponMutation, useUpdateCartMutation } = cartSlice;
