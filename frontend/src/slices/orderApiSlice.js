import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";


export const orderSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrder: builder.query({
            query: (id) => `${ORDERS_URL}/${id}`,
        }),
        getOrders: builder.query({
            query: () => `${ORDERS_URL}/`,
        }),
        createOrder: builder.mutation({
            query: (data) => ({
                url: `${ORDERS_URL}/`,
                method: 'POST',
                body: data,
            }),
        }),
        updateOrder: builder.mutation({
            query: (orderId, data) => ({
                url: `${ORDERS_URL}/${orderId}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useGetOrderQuery, useCreateOrderMutation, useUpdateOrderMutation, useDeleteOrderMutation, useGetOrdersQuery } = orderSlice;