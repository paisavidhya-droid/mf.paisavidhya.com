import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const relatedPartyApi = createApi({
  reducerPath: "relatedPartyApi",
  baseQuery: customBaseQuery,
  tagTypes: ["relatedParty"],
  endpoints: (builder) => ({
    postRelatedParty: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/related_party${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
        body: payload,
      }),
    }),
    patchRelatedParty: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/related_party/${id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const { usePatchRelatedPartyMutation, usePostRelatedPartyMutation } = relatedPartyApi;
