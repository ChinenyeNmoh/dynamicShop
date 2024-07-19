import { apiSlice } from './apiSlice';
import { ADDRESSES_URL } from "../constants";

export const shippingSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createShipping: builder.mutation({
            query: (data) => {
                return {
                    url: `${ADDRESSES_URL}/`,
                    method: 'POST',
                    body: data,
                }
               
            }
        }),
        getShipping: builder.query({
            query: () => {
                return {
                    url: `${ADDRESSES_URL}/`,
                    method: 'GET',
                }
            }
        }),
    })
});

export const { useCreateShippingMutation, useGetShippingQuery } = shippingSlice;