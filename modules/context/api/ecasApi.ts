import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const ecasApi = createApi({
  reducerPath: "ecasApi",
  baseQuery: customBaseQuery,
  tagTypes: ["address"],
  endpoints: (builder) => ({
    postSubmitCASDetails: builder.mutation({
      query: (payload) => ({
        url: "/ecas/submit_cas_details",
        method: "POST",
        body: payload,
      }),
    }),
    postSubmitOtp: builder.mutation({
      query: (payload) => ({
        url: "/ecas/submit_otp",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { usePostSubmitCASDetailsMutation, usePostSubmitOtpMutation } = ecasApi;
