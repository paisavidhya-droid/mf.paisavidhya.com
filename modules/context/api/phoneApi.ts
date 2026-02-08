import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const phoneApi = createApi({
  reducerPath: "phoneApi",
  baseQuery: customBaseQuery,
  tagTypes: ["phone"],
  endpoints: (builder) => ({
    patchPhone: builder.mutation({
      query: (payload) => ({
        url: "/phone",
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const { usePatchPhoneMutation } = phoneApi;
