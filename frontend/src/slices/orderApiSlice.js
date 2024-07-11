import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";


export const orderSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrder: builder.query({
            query: (id) => `${ORDERS_URL}/${id}`,
        }),

        
        getallOrders: builder.query({
            query: ({orderStatus, paymentStatus}) => {
                let url = `${ORDERS_URL}/allorders`;
                
                if (orderStatus && paymentStatus) {
                    url = `${ORDERS_URL}/allorders?orderStatus=${orderStatus}&paymentStatus=${paymentStatus}`;
                } else if (orderStatus) {
                    url = `${ORDERS_URL}/allorders?orderStatus=${orderStatus}`;
                } else if (paymentStatus) {
                    url = `${ORDERS_URL}/allorders?paymentStatus=${paymentStatus}`;
                }
                return { url };
            }
                
        }),
        getOrders: builder.query({
            query: () => `${ORDERS_URL}/`,
        }),
        getPaypalClientId: builder.query({
            query: () => ({
              url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5,
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

export const { useGetOrderQuery, useGetPaypalClientIdQuery, useCreateOrderMutation, useGetallOrdersQuery, useUpdateOrderMutation, useDeleteOrderMutation, useGetOrdersQuery } = orderSlice;