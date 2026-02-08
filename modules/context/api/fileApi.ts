import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: customBaseQuery,
  tagTypes: ["email"],
  endpoints: (builder) => ({
    postFile: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/file${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
        body: payload,
      }),
    }),
    postFileBase64: builder.mutation({
      query: ({ investorId, payload }) => ({
        url: `/file/base64${investorId ? `?investor_id=${investorId}` : ""}`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { usePostFileMutation, usePostFileBase64Mutation } = fileApi;
