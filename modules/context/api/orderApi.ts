import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getOrderBseDetails: builder.query({
      query: (id) => ({
        url: `/order/${id}/bse_details`,
        method: "GET",
      }),
    }),

  }),
});

export const { useLazyGetOrderBseDetailsQuery } = orderApi;
