import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";
import { cartApi } from "./cartApi";

export const bucketApi = createApi({
  reducerPath: "bucketApi",
  baseQuery: customBaseQuery,
  tagTypes: ["bucket"],
  endpoints: (builder) => ({
    getBucket: builder.query({
      query: () => ({
        url: "/bucket",
        method: "GET",
      }),
      providesTags: ["bucket"],
      transformResponse: (data) => data.data,
    }),
    postBucket: builder.mutation({
      query: (payload) => ({
        url: "/bucket",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["bucket"],
    }),
    patchBucket: builder.mutation({
      query: (payload) => ({
        url: "/bucket",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["bucket"],
    }),
    deleteBucket: builder.mutation({
      query: (id) => ({
        url: `/bucket/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["bucket"],
    }),
    postBucketPurchase: builder.mutation({
      query: ({ id, investorId, payload }) => ({
        url: `bucket/${id}/purchase${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(cartApi.util.invalidateTags(["cart"]));
      },
    }),
  }),
});

export const {
  useGetBucketQuery,
  usePostBucketPurchaseMutation,
  usePostBucketMutation,
  usePatchBucketMutation,
  useDeleteBucketMutation,
} = bucketApi;
