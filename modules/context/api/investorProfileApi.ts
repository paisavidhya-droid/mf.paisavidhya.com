import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const investorProfileApi = createApi({
  reducerPath: "investorProfileApi",
  baseQuery: customBaseQuery,
  tagTypes: ["investorProfile", "investorProfileList"],
  endpoints: (builder) => ({
    getInvestorProfile: builder.query({
      query: (investorId) => ({
        url: `/investor${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
      providesTags: ["investorProfile"],
    }),
    getInvestorProfileList: builder.query({
      query: ({ limit = 10, page = 1, name = "" }) => ({
        url: `/investor/list?limit=${limit}&page=${page}&name=${name}`,
        method: "GET",
      }),
      providesTags: ["investorProfileList"],
    }),
    patchInvestorProfile: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/investor${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_, error) => (!error ? ["investorProfile"] : []),
    }),
    postCreatePhysicalUcc: builder.mutation({
      query: (investorId) => ({
        url: `/investor/create_physical_ucc${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
      }),
      invalidatesTags: (_, error) => (!error ? ["investorProfile"] : []),
    }),
    getUploadAof: builder.mutation({
      query: (investorId) => ({
        url: `/investor/upload_aof${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
      invalidatesTags: (_, error) => (!error ? ["investorProfile"] : []),
    }),
    getInvestorBseDetails: builder.query({
      query: (investorId) => ({
        url: `/investor/bse_details${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
    }),
    getKycLink: builder.query({
      query: (investorId) => ({
        url: `/investor/kyc_link${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
    }),
    postUpdateUcc: builder.mutation({
      query: (payload) => ({
        url: "/investor/update_ucc",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_, error) => (!error ? ["investorProfile"] : []),
    }),
  }),
});

export const {
  useGetInvestorProfileQuery,
  usePatchInvestorProfileMutation,
  useLazyGetInvestorProfileListQuery,
  useGetInvestorProfileListQuery,
  usePostCreatePhysicalUccMutation,
  useLazyGetInvestorBseDetailsQuery,
  useGetUploadAofMutation,
  usePostUpdateUccMutation,
  useLazyGetKycLinkQuery,
} = investorProfileApi;