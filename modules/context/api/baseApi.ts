import { Platform } from "react-native";
import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { toastHelper } from "@niveshstar/utils";

import { logout } from "../slice";
import { RootStateType } from "../store";

let baseUrl = process.env.EXPO_PUBLIC_API_URL_FOR_WEB;
// let baseUrl = "https://app2.mfapis.club/api/v2";
// let baseUrl = "https://staging-app.mfapis.club/api/v2";
if (Platform.OS === "android" || Platform.OS === "ios") {
  baseUrl = process.env.EXPO_PUBLIC_API_URL_FOR_MOBILE;
}

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const authDetails = (getState() as RootStateType).auth;
    headers.set("access-token", authDetails.accessToken);
    headers.set("refresh-token", authDetails.refreshToken);
    return headers;
  },
});

export const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  const isBlobOrNonJson = result.meta?.response?.headers?.get("content-type")?.includes("application/json") === false;

  if (result?.error?.status === 401) {
    await api.dispatch(logout());
    // return {
    //   error: {
    //     status: 401,
    //     data: "Session expired. Please log in again.",
    //   } as FetchBaseQueryError,
    // };
  }

  if (!isBlobOrNonJson && result.error) {
    const msg = getErrorMessage(result.error);
    toastHelper("error", msg);
  }

  if (!isBlobOrNonJson && !result.error && result.data) {
    const data = result.data as { success?: boolean; message?: string };
    if (data?.success === false) {
      toastHelper("error", data.message || "Something went wrong");
    }
  }

  return result;
};

const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error?.err) return error.err;
  if (error?.data?.message) return error.data.message;
  if (error?.message) return error.message;
  return "Something went wrong";
};

export const thirdPartyBaseQuery = fetchBaseQuery();
