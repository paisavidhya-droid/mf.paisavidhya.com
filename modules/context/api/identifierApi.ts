import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";
import { investorProfileApi } from "./investorProfileApi";

export const identifierApi = createApi({
  reducerPath: "identifierApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    postIdentifier: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/identifier${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(investorProfileApi.util.invalidateTags(["investorProfile"]));
      },
    }),
    patchIdentifier: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/identifier/${id}`,
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

export const { usePostIdentifierMutation, usePatchIdentifierMutation } = identifierApi;
