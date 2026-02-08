import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
  addressApi,
  authApi,
  bankAccountApi,
  bucketApi,
  cartApi,
  ecasApi,
  emailApi,
  fileApi,
  identifierApi,
  investorHoldingApi,
  investorNoteApi,
  investorProfileApi,
  mandateApi,
  mobileOtpApi,
  orderApi,
  partnerApi,
  partnerSettingApi,
  paymentApi,
  phoneApi,
  portfolioApi,
  relatedPartyApi,
  riskApi,
  rtaFeedsApi,
  schemesApi,
  sxpApi,
  thirdPartyApi,
} from "../api";
import { authReducer } from "../slice";

const appReducer = combineReducers({
  auth: authReducer,
  [addressApi.reducerPath]: addressApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [bankAccountApi.reducerPath]: bankAccountApi.reducer,
  [bucketApi.reducerPath]: bucketApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [ecasApi.reducerPath]: ecasApi.reducer,
  [emailApi.reducerPath]: emailApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [identifierApi.reducerPath]: identifierApi.reducer,
  [investorHoldingApi.reducerPath]: investorHoldingApi.reducer,
  [investorNoteApi.reducerPath]: investorNoteApi.reducer,
  [investorProfileApi.reducerPath]: investorProfileApi.reducer,
  [mandateApi.reducerPath]: mandateApi.reducer,
  [mobileOtpApi.reducerPath]: mobileOtpApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [partnerApi.reducerPath]: partnerApi.reducer,
  [partnerSettingApi.reducerPath]: partnerSettingApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [phoneApi.reducerPath]: phoneApi.reducer,
  [portfolioApi.reducerPath]: portfolioApi.reducer,
  [relatedPartyApi.reducerPath]: relatedPartyApi.reducer,
  [riskApi.reducerPath]: riskApi.reducer,
  [rtaFeedsApi.reducerPath]: rtaFeedsApi.reducer,
  [schemesApi.reducerPath]: schemesApi.reducer,
  [sxpApi.reducerPath]: sxpApi.reducer,
  [thirdPartyApi.reducerPath]: thirdPartyApi.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout/fulfilled") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(addressApi.middleware)
      .concat(authApi.middleware)
      .concat(bankAccountApi.middleware)
      .concat(bucketApi.middleware)
      .concat(cartApi.middleware)
      .concat(ecasApi.middleware)
      .concat(emailApi.middleware)
      .concat(fileApi.middleware)
      .concat(identifierApi.middleware)
      .concat(investorHoldingApi.middleware)
      .concat(investorNoteApi.middleware)
      .concat(investorProfileApi.middleware)
      .concat(mandateApi.middleware)
      .concat(mobileOtpApi.middleware)
      .concat(orderApi.middleware)
      .concat(partnerApi.middleware)
      .concat(partnerSettingApi.middleware)
      .concat(paymentApi.middleware)
      .concat(phoneApi.middleware)
      .concat(portfolioApi.middleware)
      .concat(relatedPartyApi.middleware)
      .concat(riskApi.middleware)
      .concat(rtaFeedsApi.middleware)
      .concat(schemesApi.middleware)
      .concat(sxpApi.middleware)
      .concat(thirdPartyApi.middleware),
});

export default store;

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
