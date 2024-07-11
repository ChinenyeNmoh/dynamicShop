import { apiSlice } from "./apiSlice";
import { ENQUIRY_URL } from "../constants";

export const enquirySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createEnquiry: builder.mutation({
            query: (data) => {
                return {
                    url: `${ENQUIRY_URL}/`,
                    method: 'POST',
                    body: data,
                }
            },
        }),
        getEnquiries: builder.query({
            query: (status) => {
                let url = `${ENQUIRY_URL}/`;
                if (status) {
                    url = `${ENQUIRY_URL}/?status=${status}`;
                }
                return url;
            },
                    keepUnusedDataFor: 5,
                    validatesTags: ['Enquiry'],
        }),
    updateEnquiry: builder.mutation({
        query: (id) => {
            return {
                url: `${ENQUIRY_URL}/${id}`,
                method: 'PUT',
                invalidateTags: ['Enquiry'],
            }
        },
    }),
    deleteEnquiry: builder.mutation({
        query: (id) => {
            return {
                url: `${ENQUIRY_URL}/${id}`,
                method: 'DELETE',
            }
        },
    }),
    getEnquiry: builder.query({
        query: (id) => {
            return {
                url: `${ENQUIRY_URL}/${id}`,
                method: 'GET',
            }
        },
    }),
}),
});

export const { useCreateEnquiryMutation, useGetEnquiriesQuery, useUpdateEnquiryMutation, useDeleteEnquiryMutation, useGetEnquiryQuery } = enquirySlice;