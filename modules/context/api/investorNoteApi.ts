import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const investorNoteApi = createApi({
  reducerPath: "investorNoteApi",
  baseQuery: customBaseQuery,
  tagTypes: ["investorNote"],
  endpoints: (builder) => ({
    getInvestorNote: builder.query({
      query: (investorId) => ({
        url: `/investor_note?investor_id=${investorId}`,
        method: "GET",
      }),
      providesTags: ["investorNote"],
    }),
    postInvestorNote: builder.mutation({
      query: (payload) => ({
        url: "/investor_note",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["investorNote"],
    }),
    deleteInvestorNote: builder.mutation({
      query: (id) => ({
        url: `/investor_note/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["investorNote"],
    }),
  }),
});

export const { useGetInvestorNoteQuery, usePostInvestorNoteMutation, useDeleteInvestorNoteMutation } = investorNoteApi;
