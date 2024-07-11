import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `${USERS_URL}/allusers`,
      keepUnusedDataFor: 5,
    }),
    getUserDetails: builder.query({
      query: (id) => `${USERS_URL}/${id}`,
      keepUnusedDataFor: 5,
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    forgotPasswd: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgotpassword`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePasswd: builder.mutation({
      //ensure to destructure the data it will take in
      //id is the id of the person whose password is to be updated
      query: ({ id, ...data}) => ({
        url: `${USERS_URL}/updatepassword/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query:(id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    
    updateUser: builder.mutation({
      query:({id, ...data}) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => `${USERS_URL}/profile`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { 
  useGetProfileQuery,
  useLoginMutation, 
  useProfileMutation, 
  useLogoutMutation, 
  useRegisterMutation, 
  useForgotPasswdMutation, 
  useUpdatePasswdMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery
 } = userSlice;
