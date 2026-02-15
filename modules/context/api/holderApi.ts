import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";
import { investorProfileApi } from "./investorProfileApi";

export const holderApi = createApi({
  reducerPath: "holderApi",
  baseQuery: customBaseQuery,
  tagTypes: ["holder"],
  endpoints: (builder) => ({
    postHolder: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/holder${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(investorProfileApi.util.invalidateTags(["investorProfile"]));
      },
    }),
    patchHolder: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/holder/${id}`,
        method: "PATCH",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(investorProfileApi.util.invalidateTags(["investorProfile"]));
      },
    }),
  }),
});

export const { usePostHolderMutation, usePatchHolderMutation } = holderApi;