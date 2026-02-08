import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const mandateApi = createApi({
  reducerPath: "mandateApi",
  baseQuery: customBaseQuery,
  tagTypes: ["mandate"],
  endpoints: (builder) => ({
    getMandateList: builder.query({
      query: ({ page, limit, investorId }) => ({
        url: `/mandate?page=${page}&limit=${limit}${investorId ? `&investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
      transformResponse: (data) => data.data,
      providesTags: ["mandate"],
    }),
    postMandate: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/mandate${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_, error) => (!error ? ["mandate"] : []),
    }),
    deleteMandate: builder.mutation({
      query: (id) => ({
        url: `/mandate/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error) => (!error ? ["mandate"] : []),
    }),
    getMandateBseDetails: builder.query({
      query: (id) => ({
        url: `/mandate/${id}/bse_details`,
        method: "GET",
      }),
    }),
    getMandateApprovalLink: builder.query({
      query: (id) => ({
        url: `/mandate/${id}/approval_link`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetMandateListQuery,
  usePostMandateMutation,
  useDeleteMandateMutation,
  useLazyGetMandateBseDetailsQuery,
  useLazyGetMandateApprovalLinkQuery,
} = mandateApi;
