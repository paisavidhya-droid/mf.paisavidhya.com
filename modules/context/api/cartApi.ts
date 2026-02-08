import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: customBaseQuery,
  tagTypes: ["cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: (investorId) => ({
        url: `/cart${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
      transformResponse: (data) => data.data,
      providesTags: ["cart"],
    }),
    postCart: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/cart${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["cart"],
    }),
    patchCart: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/cart/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["cart"],
    }),
    postCartOrder: builder.mutation({
      query: (payload) => ({
        url: "/cart/order",
        body: payload,
        method: "POST",
      }),
      invalidatesTags: ["cart"],
    }),
    postBulkDeleteCart: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/cart/delete${investorId ? `?investor_id=${investorId}` : ""}`,
        body: payload,
        method: "POST",
      }),
      invalidatesTags: ["cart"],
    }),
    deleteCart: builder.mutation({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),
    getApprovalLink: builder.query({
      query: (investorId) => ({
        url: `/cart/${investorId}/approval_link`,
        method: "GET",
      }),
      providesTags: ["cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  usePostCartMutation,
  usePostCartOrderMutation,
  useDeleteCartMutation,
  usePatchCartMutation,
  usePostBulkDeleteCartMutation,
  useLazyGetApprovalLinkQuery,
} = cartApi;
