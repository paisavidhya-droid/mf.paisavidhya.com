import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";
import { investorProfileApi } from "./investorProfileApi";

export const bankAccountApi = createApi({
  reducerPath: "bankAccountApi",
  baseQuery: customBaseQuery,
  tagTypes: ["bankAccount"],
  endpoints: (builder) => ({
    getBankAccount: builder.query({
      query: () => ({
        url: "/bank_account",
        method: "GET",
      }),
      transformResponse: (data) => data.data,
      providesTags: ["bankAccount"],
    }),
    getAllBankAccount: builder.query({
      query: (investorId) => ({
        url: `/bank_account/all${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "GET",
      }),
      transformResponse: (data) => data.data,
    }),
    getPaymentOptions: builder.query({
      query: () => ({
        url: `/bank_account/payment_options`,
        method: "GET",
      }),
      transformResponse: (data) => data.data,
    }),
    postBankAccount: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/bank_account${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["bankAccount"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(investorProfileApi.util.invalidateTags(["investorProfile"]));
      },
    }),
    patchBankAccount: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/bank_account/${id}`,
        method: "PATCH",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(investorProfileApi.util.invalidateTags(["investorProfile"]));
      },
    }),
    deleteBankAccount: builder.mutation({
      query: (id) => ({
        url: `/bank_account/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(investorProfileApi.util.invalidateTags(["investorProfile"]));
      },
    }),
  }),
});

export const {
  usePatchBankAccountMutation,
  usePostBankAccountMutation,
  useGetBankAccountQuery,
  useGetAllBankAccountQuery,
  useGetPaymentOptionsQuery,
  useDeleteBankAccountMutation,
} = bankAccountApi;
