import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    postCancelOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}/cancel`,
        method: "POST",
      }),
    }),
    getOrderBseDetails: builder.query({
      query: (id) => ({
        url: `/order/${id}/bse_details`,
        method: "GET",
      }),
    }),
  }),
});

export const { usePostCancelOrderMutation, useLazyGetOrderBseDetailsQuery } = orderApi;
