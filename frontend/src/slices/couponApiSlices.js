import { COUPON_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const couponSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => `${COUPON_URL}/`,
            keepUnusedDataFor: 5,
            validatesTags: ['COUPON'],
        }),
        createCoupon: builder.mutation({
            query: (data) => ({
                url: `${COUPON_URL}/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['COUPON'],
        }),
        updateCoupon: builder.mutation({
            query: ({id, ...data}) => ({
                url: `${COUPON_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `${COUPON_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useGetCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation, useUpdateCouponMutation } = couponSlice;