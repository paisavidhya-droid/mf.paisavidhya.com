import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";
import { investorProfileApi } from "./investorProfileApi";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: customBaseQuery,
  tagTypes: ["address"],
  endpoints: (builder) => ({
    postAddress: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/address${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(investorProfileApi.util.invalidateTags(["investorProfile"]));
      },
    }),
    patchAddress: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/address/${id}`,
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

export const { usePatchAddressMutation, usePostAddressMutation } = addressApi;
