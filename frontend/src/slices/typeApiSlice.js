import { TYPES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const typeSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTypes: builder.query({
            query: () => `${TYPES_URL}/`,
            keepUnusedDataFor: 5,
            validatesTags: ['Types'],
        }),
        createType: builder.mutation({
            query: (data) => ({
                url: `${TYPES_URL}/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Types'],
        }),
        updateType: builder.mutation({
            query: ({id, ...data}) => ({
                url: `${TYPES_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteType: builder.mutation({
            query: (id) => ({
                url: `${TYPES_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useGetTypesQuery, useCreateTypeMutation, useDeleteTypeMutation, useUpdateTypeMutation } = typeSlice;