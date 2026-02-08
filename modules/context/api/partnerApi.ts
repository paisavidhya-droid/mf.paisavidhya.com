import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const partnerApi = createApi({
  reducerPath: "partnerApi",
  baseQuery: customBaseQuery,
  tagTypes: ["partner"],
  endpoints: (builder) => ({
    postPartnerLogin: builder.mutation({
      query: (payload) => ({
        url: "/partner/login",
        method: "POST",
        body: payload,
      }),
    }),
    getPartner: builder.query({
      query: () => ({
        url: "/partner",
        method: "GET",
      }),
      providesTags: ["partner"],
    }),
    patchPartner: builder.mutation({
      query: (payload) => ({
        url: "/partner",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["partner"],
    }),
  }),
});

export const { usePostPartnerLoginMutation, useGetPartnerQuery, usePatchPartnerMutation } = partnerApi;
