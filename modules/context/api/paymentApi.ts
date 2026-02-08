import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getPaymentById: builder.query({
      query: (id) => ({
        url: `/payment/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGetPaymentByIdQuery } = paymentApi;
