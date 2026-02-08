import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const investorHoldingApi = createApi({
  reducerPath: "investorHoldingApi",
  baseQuery: customBaseQuery,
  tagTypes: [],
  endpoints: (builder) => ({
    getFolio: builder.query({
      query: (investorId) => ({
        url: `/investor_holding/folio?profile_id=${investorId}`,
        method: "GET",
      }),
      transformResponse: (data) => data.folio_data,
    }),
    getFolioAmount: builder.query({
      query: (investorId) => ({
        url: `/investor_holding/folio_amount?profile_id=${investorId}`,
        method: "GET",
      }),
      transformResponse: (data) => data.holding,
    }),
  }),
});

export const { useGetFolioQuery, useGetFolioAmountQuery } = investorHoldingApi;
