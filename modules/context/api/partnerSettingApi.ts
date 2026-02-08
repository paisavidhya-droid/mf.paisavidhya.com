import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const partnerSettingApi = createApi({
  reducerPath: "partnerSettingApi",
  baseQuery: customBaseQuery,
  tagTypes: [],
  endpoints: (builder) => ({
    getPartnerSetting: builder.query({
      query: (id) => ({
        url: `/partner_setting/${id}`,
        method: "GET",
      }),
    }),
    postPartnerSetting: builder.mutation({
      query: (payload) => ({
        url: "/partner_setting",
        method: "POST",
        body: payload,
      }),
    }),
    patchPartnerSetting: builder.mutation({
      query: (payload) => ({
        url: "/partner_setting",
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const { useGetPartnerSettingQuery, usePostPartnerSettingMutation, usePatchPartnerSettingMutation } =
  partnerSettingApi;
