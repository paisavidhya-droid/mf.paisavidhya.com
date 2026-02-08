import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const sxpApi = createApi({
  reducerPath: "sxpApi",
  baseQuery: customBaseQuery,
  tagTypes: ["sxpList"],
  endpoints: (builder) => ({
    getSxpBseDetails: builder.query({
      query: (id) => ({
        url: `/sxp/${id}/bse_details`,
        method: "GET",
      }),
    }),
    getSxpBseHistory: builder.query({
      query: (id) => ({
        url: `/sxp/${id}/bse_trxn_history`,
        method: "GET",
      }),
      transformResponse: (data) => data.data,
    }),
    getSxpList: builder.query({
      query: ({ page, limit, investorId }) => ({
        url: `/sxp?page=${page}&limit=${limit}${investorId ? `&investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
      providesTags: ["sxpList"],
      transformResponse: (data) => data.data,
    }),
    postCancelSxp: builder.mutation({
      query: (payload) => ({
        url: "/sxp/cancel",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_, error) => (!error ? ["sxpList"] : []),
    }),
  }),
});
export const {
  useLazyGetSxpBseDetailsQuery,
  useGetSxpListQuery,
  useLazyGetSxpBseHistoryQuery,
  usePostCancelSxpMutation,
} = sxpApi;
