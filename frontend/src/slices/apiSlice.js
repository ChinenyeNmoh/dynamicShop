/* creatApi helps in creating endpoints and handling data synchronization with your Redux store.
fetchBaseQuery A utility function provided by RTK Query to create a basic query function for making HTTP requests.
*/

import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

// Create a base query function using fetchBaseQuery and set the base URL to BASE_URL
const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

// Define and export an API slice using createApi
export const apiSlice = createApi({
  // Set the base query function for this API slice to the previously defined baseQuery
  baseQuery,
  
  // Define tag types used for cache invalidation and data refetching
  tagTypes: ['Product', 'Order', 'User', 'Cart', 'Category', 'Type', 'Enquiry', 'Coupon'],


  // Define the endpoints for this API slice using a builder function
  endpoints: (builder) => ({}),
});
