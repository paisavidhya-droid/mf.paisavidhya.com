import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    postLogin: builder.mutation({
      query: (payload) => ({
        url: "/user/login",
        method: "POST",
        body: payload,
      }),
    }),
    postSignup: builder.mutation({
      query: (payload) => ({
        url: "/user/signup",
        method: "POST",
        body: payload,
      }),
    }),
    getPartnerWhiteLabelInfo: builder.query({
      query: (referralLink) => ({
        url: `/partner_whitelabeling/${referralLink}`,
        method: "GET",
      }),
    }),
    patchPassword: builder.mutation({
      query: (payload) => ({
        url: "/user/update_password",
        method: "PATCH",
        body: payload,
      }),
    }),
    postResetPassword: builder.mutation({
      query: (payload) => ({
        url: "/user/reset_password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  usePostLoginMutation,
  usePostSignupMutation,
  useGetPartnerWhiteLabelInfoQuery,
  usePatchPasswordMutation,
  usePostResetPasswordMutation,
} = authApi;
