import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { delteItemInLocalStorage, setItemInLocalStorage } from "@niveshstar/utils";

const initialState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  userType: "" as "investor" | "partner",
  accessToken: "",
  refreshToken: "",
  uccRegistered: false,
};

export const setAuthDetail = createAsyncThunk("auth/setAuthDetail", async (authDetail: typeof initialState) => {
  await setItemInLocalStorage("authDetail", authDetail);
  return authDetail;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await delteItemInLocalStorage("authDetail");
  return null;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setAuthDetail.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(logout.fulfilled, () => {
        return initialState;
      });
  },
});

export default authSlice.reducer;
