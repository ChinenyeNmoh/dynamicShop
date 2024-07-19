import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';
import { IMAGE_URL } from '../constants';

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ category = '', productType = '', sort = '', sale,  keyword='', page=1}) => {
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
        if (keyword) {
          params.append('keyword', keyword);
        }
        if(page) params.append('page', page);

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
      providesTags: ['Products'],
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
    }),
  
  updateProduct: builder.mutation({
    query: ({ id,...data}) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'PUT',
        body: data,
    }),
    invalidatesTags: ['Products'],
  }),
  deleteProduct: builder.mutation({
    query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'DELETE',
    }),
    invalidatesTags: ['Products'],
  }),
  uploadImage: builder.mutation({
    query: (images) => {
      const formData = new FormData();
      formData.append('images', images);
      return {
        url: `${IMAGE_URL}/`,
        method: 'POST',
        body: formData,
      };
    },
    invalidatesTags: ['Products'],
  }),
  productRating: builder.mutation({
    query: (data) => ({
      url: `${PRODUCTS_URL}/rating`,
      method: 'POST',
      body: data
    }),
    invalidatesTags: ['Products'],
}), 
  }),
});

// this is a hook that returns the query function for fetching products
export const {
   useGetProductsQuery, 
   useGetProductDetailsQuery,
    useUploadImageMutation, 
    useCreateProductMutation, 
    useUpdateProductMutation, 
    useDeleteProductMutation,
    useProductRatingMutation,
   } = productSlice;
