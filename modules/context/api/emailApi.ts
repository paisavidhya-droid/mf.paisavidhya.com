import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const emailApi = createApi({
  reducerPath: "emailApi",
  baseQuery: customBaseQuery,
  tagTypes: ["email"],
  endpoints: (builder) => ({
    postEmail: builder.mutation({
      query: (payload) => ({
        url: "/email_address",
        method: "POST",
        body: payload,
      }),
    }),
    patchEmail: builder.mutation({
      query: (payload) => ({
        url: "/email_address",
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const { usePatchEmailMutation, usePostEmailMutation } = emailApi;
