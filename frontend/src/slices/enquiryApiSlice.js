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
            query: ({ status, page=1, keyword='' }) => {
                const params = new URLSearchParams();
                if (status) {
                    params.append('status', status);
                }
                if (keyword) {
                    params.append('keyword', keyword);
                }
                if (page) {
                    params.append('page', page);
                }
        
                const url = `${ENQUIRY_URL}/?${params.toString()}`;
                return { url };
            },
            keepUnusedDataFor: 5,
            providesTags: ['Enquiry'],
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