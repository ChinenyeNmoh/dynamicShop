import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ category = '', productType = '', sort = '', sale, page = 1, limit = 10 }) => {
        let url = PRODUCTS_URL;
        const params = new URLSearchParams();

        if (category) {
          params.append('category', category);
        }

        if (productType) {
          params.append('productType', productType);
        }

        if (sort) {
          params.append('sort', sort);
        }

        if (sale) {
          params.append('sale', sale);
        }

        params.append('page', page);
        params.append('limit', limit);

        url = `${PRODUCTS_URL}?${params.toString()}`;

        return { url };
      },
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: data,
      }),
      //getproducts function with validate Products Tag will automatically refetch since we are 
      //invalidating the tag here, ensuring that the newly created product is included in the updated list.
      invalidatesTags: ['Products'],
    })
  }),
  
});

// this is a hook that returns the query function for fetching products
export const { useGetProductsQuery, useGetProductDetailsQuery } = productSlice;
