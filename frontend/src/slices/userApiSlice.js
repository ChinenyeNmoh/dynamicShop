import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `${USERS_URL}/allusers`,
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
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useForgotPasswdMutation, useUpdatePasswdMutation } = userSlice;
