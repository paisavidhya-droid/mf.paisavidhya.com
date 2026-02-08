import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const rtaFeedsApi = createApi({
  reducerPath: "rtaFeedsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["rtaFeeds"],
  endpoints: (builder) => ({
    getRtaFeeds: builder.query({
      query: () => ({
        url: "/rta_feeds",
        method: "GET",
      }),
      providesTags: ["rtaFeeds"],
    }),
    postRtaFeeds: builder.mutation({
      query: (payload) => ({
        url: "/rta_feeds",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["rtaFeeds"],
    }),
  }),
});

export const { useGetRtaFeedsQuery, usePostRtaFeedsMutation } = rtaFeedsApi;
