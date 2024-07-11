import { CATEGORIES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const categorySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => `${CATEGORIES_URL}/`,
            keepUnusedDataFor: 5,
            validatesTags: ['Categories'],
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                url: `${CATEGORIES_URL}/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Categories'],
        }),
        updateCategory: builder.mutation({
            query: ({id, ...data}) => ({
                url: `${CATEGORIES_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `${CATEGORIES_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation } = categorySlice;