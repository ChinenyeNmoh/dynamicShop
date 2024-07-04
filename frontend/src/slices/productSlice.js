import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ category = '', productType = '' }) => {
        let url = PRODUCTS_URL;
        
        if (category && productType) {
          url = `${PRODUCTS_URL}?category=${category}&productType=${productType}`;
        } else if (category) {
          url = `${PRODUCTS_URL}?category=${category}`;
        } else if (productType) {
          url = `${PRODUCTS_URL}?productType=${productType}`;
        }
        
        return { url };
      },
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
  
});

// this is a hook that returns the query function for fetching products
export const { useGetProductsQuery, useGetProductDetailsQuery } = productSlice;
