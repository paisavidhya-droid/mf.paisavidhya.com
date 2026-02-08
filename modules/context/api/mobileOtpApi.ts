import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const mobileOtpApi = createApi({
  reducerPath: "mobileOtpApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    postSingupOtp: builder.mutation({
      query: (payload) => ({
        url: "/otp/signup",
        method: "POST",
        body: payload,
      }),
    }),
    postTransactionOtp: builder.mutation({
      query: (payload) => ({
        url: "/otp/transaction",
        method: "POST",
        body: payload,
      }),
    }),
    postUpdateUccOtp: builder.mutation({
      query: (payload) => ({
        url: "/otp/update_ucc",
        method: "POST",
        body: payload,
      }),
    }),
    postCancelSxpOtp: builder.mutation({
      query: (payload) => ({
        url: "/otp/cancel_sxp",
        method: "POST",
        body: payload,
      }),
    }),
    postResetPassowrdOtp: builder.mutation({
      query: (payload) => ({
        url: "/otp/reset_password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  usePostSingupOtpMutation,
  usePostTransactionOtpMutation,
  usePostUpdateUccOtpMutation,
  usePostCancelSxpOtpMutation,
  usePostResetPassowrdOtpMutation,
} = mobileOtpApi;
