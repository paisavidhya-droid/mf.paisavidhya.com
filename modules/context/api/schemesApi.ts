import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const schemesApi = createApi({
  reducerPath: "schemesApi",
  baseQuery: customBaseQuery,
  tagTypes: ["schemesList", "schemes", "relatedSchemes"],
  endpoints: (builder) => ({
    getSchemes: builder.query({
      query: ({ page, limit, schemeName }) => ({
        url: `/scheme?page=${page}&limit=${limit}&name=${schemeName}`,
        method: "GET",
      }),
      providesTags: ["schemesList"],
    }),
    getSchemeById: builder.query({
      query: (schemeId) => ({
        url: `/scheme/${schemeId}`,
        method: "GET",
      }),
      providesTags: ["schemes"],
    }),
  }),
});

export const { useLazyGetSchemesQuery, useGetSchemeByIdQuery, useLazyGetSchemeByIdQuery } = schemesApi;
