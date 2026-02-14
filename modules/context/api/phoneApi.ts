import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const phoneApi = createApi({
  reducerPath: "phoneApi",
  baseQuery: customBaseQuery,
  tagTypes: ["phone"],
  endpoints: (builder) => ({
    postPhone: builder.mutation({
      query: (payload) => ({
        url: "/phone_number",
        method: "POST",
        body: payload,
      }),
    }),
    patchPhone: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/phone_number/${id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const { usePatchPhoneMutation, usePostPhoneMutation } = phoneApi;
