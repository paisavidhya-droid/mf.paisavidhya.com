import { Platform } from "react-native";
import { createApi } from "@reduxjs/toolkit/query/react";

import { ifscInfoApi } from "@niveshstar/constant";

import { thirdPartyBaseQuery } from "./baseApi";

let mfBaseUrl = process.env.EXPO_PUBLIC_API_URL_FOR_WEB;
if (Platform.OS === "android" || Platform.OS === "ios") {
  mfBaseUrl = process.env.EXPO_PUBLIC_API_URL_FOR_MOBILE;
}

mfBaseUrl = "https://app2.mfapis.club/api/v2";

export const thirdPartyApi = createApi({
  reducerPath: "thirdPartyApi",
  baseQuery: thirdPartyBaseQuery,
  endpoints: (builder) => ({
    getIfscDetails: builder.query({
      query: (ifscCode) => ({
        url: `${ifscInfoApi}/${ifscCode}`,
        method: "GET",
      }),
    }),
    getCartWithToken: builder.query({
      query: ({ accessToken }) => ({
        url: `${mfBaseUrl}/cart`,
        method: "GET",
        headers: {
          "access-token": accessToken,
          "refresh-token": accessToken,
        },
      }),
      transformResponse: (data) => data.data,
    }),
    getPaymentWithToken: builder.query({
      query: ({ accessToken }) => ({
        url: `${mfBaseUrl}/bank_account/payment_options`,
        method: "GET",
        headers: {
          "access-token": accessToken,
          "refresh-token": accessToken,
        },
      }),
      transformResponse: (data) => data.data,
    }),
    getPaymentByIdWithToken: builder.query({
      query: ({ accessToken, id }) => ({
        url: `${mfBaseUrl}/payment/${id}`,
        method: "GET",
        headers: {
          "access-token": accessToken,
          "refresh-token": accessToken,
        },
      }),
    }),
    postTransactionOtpWithToken: builder.mutation({
      query: ({ accessToken, ...payload }) => ({
        url: `${mfBaseUrl}/otp/transaction`,
        method: "POST",
        body: payload,
        headers: {
          "access-token": accessToken,
          "refresh-token": accessToken,
        },
      }),
    }),
    postCartOrderWithToken: builder.mutation({
      query: ({ accessToken, ...payload }) => ({
        url: `${mfBaseUrl}/cart/order`,
        body: payload,
        method: "POST",
        headers: {
          "access-token": accessToken,
          "refresh-token": accessToken,
        },
      }),
    }),
  }),
});

export const {
  useLazyGetIfscDetailsQuery,
  useGetCartWithTokenQuery,
  useGetPaymentWithTokenQuery,
  useLazyGetPaymentByIdWithTokenQuery,
  usePostTransactionOtpWithTokenMutation,
  usePostCartOrderWithTokenMutation,
} = thirdPartyApi;
