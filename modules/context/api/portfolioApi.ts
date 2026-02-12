import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const portfolioApi = createApi({
  reducerPath: "portfolioApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getAllOrdersList: builder.query({
      query: ({ page, limit, investorId }) => ({
        url: `/portfolio?page=${page}&limit=${limit}${investorId ? `&investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
      transformResponse: (data) => data.data,
    }),
    getHoldings: builder.query({
      query: (investorId) => ({
        url: `/portfolio/holdings${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
      transformResponse: (data) => data.data,
    }),
    getRedemptionScheme: builder.query({
      query: (investorId) => ({
        url: `/portfolio/scheme${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
    }),
    getRedemptionSchemeById: builder.query({
      query: ({ schemeId, investorId }) => ({
        url: `/portfolio/scheme/${schemeId}${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
    }),
    getPartnerOrdersList: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/portfolio/partner?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (data) => data.data,
    }),
  }),
});

export const {
  useGetAllOrdersListQuery,
  useGetHoldingsQuery,
  useLazyGetRedemptionSchemeByIdQuery,
  useLazyGetRedemptionSchemeQuery,
  useGetPartnerOrdersListQuery,
} = portfolioApi;
