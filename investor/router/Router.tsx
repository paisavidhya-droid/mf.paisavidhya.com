import React, { useContext, useEffect, useMemo } from "react";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RootStateType, ScreenContext, ThemeContext } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Calculator, Column, ErrorBoundary, FlexRow } from "@niveshstar/ui";
import { toastConfig } from "@niveshstar/utils";

import { LeftNavigation, Navbar } from "../components/common";
import Analytics from "../container/Analytics/Analytics";
import Login from "../container/Auth/Login";
import Register from "../container/Auth/Regsiter";
import ResetPassword from "../container/Auth/ResetPassword";
import SignUp from "../container/Auth/SignUp";
import Flow from "../container/Flow/Flow";
import FlowMandate from "../container/Flow/FlowMandate";
import Holdings from "../container/Home/Holdings";
import Home from "../container/Home/Home";
import Import from "../container/Home/Import";
import MorePage from "../container/Home/MorePage";
import MutualFunds from "../container/Home/MutualFunds";
import Order from "../container/Home/OrderList";
import Scheme from "../container/Home/Scheme";
import SIP from "../container/Home/SIP";
import UserCart from "../container/Home/UserCart";
import UserMandate from "../container/Home/UserMandate";
import PaymentSuccess from "../container/Payment/PaymentSuccess";
import Plans from "../container/Plans/Plans";
import BankDetails from "../container/Profile/OnBoarding/BankDetails";
import CompanyDetails from "../container/Profile/OnBoarding/CompanyDetails";
import HolderDetails from "../container/Profile/OnBoarding/HolderDetails";
import NomineeDetails from "../container/Profile/OnBoarding/NomineeDetails";
import OnBoarding from "../container/Profile/OnBoarding/OnBoarding";
import PersonalDetails from "../container/Profile/OnBoarding/PersonalDetails";
import SignDetails from "../container/Profile/OnBoarding/SignDetails";
import Profile from "../container/Profile/Profile";

const ProtectedRoutes = (props: { children: React.ReactNode }) => {
  const { screenType } = useContext(ScreenContext);
  const { themeColor } = useContext(ThemeContext);

  const { authNavigator, navigator, location } = useNavigation();
  const authDetail = useSelector((state: RootStateType) => state.auth);

  useEffect(() => {
    if (
      !authDetail.id &&
      location.pathname !== "/signup" &&
      location.pathname !== "/login" &&
      location.pathname !== "/reset-password" &&
      location.pathname !== "/flow" &&
      location.pathname !== "/flow/mandate"
    ) {
      authNavigator.navigate("login");
      return;
    }

    if (
      !authDetail.firstName &&
      location.pathname !== "/register" &&
      location.pathname !== "/signup" &&
      location.pathname !== "/login" &&
      location.pathname !== "/reset-password" &&
      location.pathname !== "/flow" &&
      location.pathname !== "/flow/mandate"
    ) {
      authNavigator.navigate("register");
      return;
    }
  }, [location.pathname, authDetail, authNavigator]);

  const [leftPanel, rightPanel, showNavbar] = useMemo(() => {
    if (!authDetail.id) return [0, 24, false];
    if (location.pathname === "/flow") return [0, 24, false];
    if (location.pathname === "/register") return [0, 24, false];
    if (location.pathname === "/flow/mandate") return [0, 24, false];
    if (location.pathname === "/payment-success") return [0, 24, false];
    if (location.pathname.includes("onboarding")) return [0, 24, false];
    if (screenType === "sm") return [0, 24, true];
    if (screenType === "md") return [6, 18, false];

    return [4, 20, false];
  }, [authDetail.id, screenType, location.pathname]);

  return (
    <ErrorBoundary navigate={navigator.navigate} themeColor={themeColor}>
      <FlexRow alignItems="stretch" style={{ flex: 1 }}>
        <Column col={leftPanel} style={{ borderRightWidth: 1, borderColor: themeColor.gray[6] }}>
          <LeftNavigation />
        </Column>
        <Column col={rightPanel} style={{ flex: 1 }}>
          {showNavbar ? <Navbar /> : null}
          {props.children}
        </Column>
      </FlexRow>
    </ErrorBoundary>
  );
};

export default function Router() {
  return (
    <>
      <BrowserRouter>
        <ProtectedRoutes>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<Register />} />

            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/" element={<Home />} />
            <Route path="/mutual-funds" element={<MutualFunds />} />
            <Route path="/mutual-funds/scheme" element={<Scheme />} />

            <Route path="/cart" element={<UserCart />} />

            <Route path="/more" element={<MorePage />} />

            <Route path="/sip" element={<SIP />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/import" element={<Import />} />
            <Route path="/mandate" element={<UserMandate />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/plans/calculator" element={<Calculator />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/order" element={<Order />} />

            <Route path="/flow" element={<Flow />} />
            <Route path="/flow/mandate" element={<FlowMandate />} />
            <Route path="/analytics" element={<Analytics />} />

            <Route path="/profile/onboarding" element={<OnBoarding />} />
            <Route path="/profile/onboarding/personal-details" element={<PersonalDetails />} />
            <Route path="/profile/onboarding/holder-details" element={<HolderDetails />} />
            <Route path="/profile/onboarding/nominee-details" element={<NomineeDetails />} />
            <Route path="/profile/onboarding/bank-details" element={<BankDetails />} />
            <Route path="/profile/onboarding/company-details" element={<CompanyDetails />} />
            <Route path="/profile/onboarding/sign-details" element={<SignDetails />} />
          </Routes>
        </ProtectedRoutes>
      </BrowserRouter>
      <Toast config={toastConfig} />
    </>
  );
}