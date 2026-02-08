import React, { useContext, useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  AppDispatch,
  RootStateType,
  ScreenContext,
  setAuthDetail,
  ThemeContext,
  useGetInvestorProfileQuery,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Padding } from "@niveshstar/ui";

import AddressTab from "../../components/Profile/Main/AddressTab";
import BankTab from "../../components/Profile/Main/BankTab";
import BseTab from "../../components/Profile/Main/BseTab";
import CommunicationTab from "../../components/Profile/Main/CommunicationTab";
import NomineeTab from "../../components/Profile/Main/NomineeTab";
import PasswordTab from "../../components/Profile/Main/PasswordTab";
import PersonalTab from "../../components/Profile/Main/PersonalTab";
import ProfileMobileNav from "../../components/Profile/Main/ProfileMobileNav";
import RiskAssessmentsTab from "../../components/Profile/Main/RiskAssessmentsTab";

function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const { navigator, params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);

  const profileTab = params?.profileTab || "0";

  const { data: investorProfile = { data: null }, isLoading } = useGetInvestorProfileQuery(undefined, {
    skip: !authDetail.id,
  });

  useEffect(() => {
    if (!investorProfile.data) return;

    if (!investorProfile.data.signature) {
      navigator.navigate("profile", "onboarding");
      return;
    }

    if (authDetail.uccRegistered === Boolean(investorProfile.data?.client_code)) {
      return;
    }

    dispatch(
      setAuthDetail({
        ...authDetail,
        uccRegistered: Boolean(investorProfile.data.client_code),
      })
    );
  }, [investorProfile, navigator, dispatch, authDetail]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      {screenType !== "sm" ? null : (
        <>
          <ProfileMobileNav />
          <Padding height={16} />
        </>
      )}

      {isLoading ? (
        <View style={{ flexGrow: 1, justifyContent: "center" }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </View>
      ) : null}

      {isLoading || !investorProfile.data ? null : (
        <>
          {profileTab === "0" ? <PersonalTab investorProfile={investorProfile.data} /> : null}
          {profileTab === "1" ? <AddressTab investorProfile={investorProfile.data} /> : null}
          {profileTab === "2" ? <NomineeTab investorProfile={investorProfile.data} /> : null}
          {profileTab === "3" ? <BankTab investorProfile={investorProfile.data} /> : null}
          {profileTab === "4" ? <BseTab investorProfile={investorProfile.data} /> : null}
          {profileTab === "5" ? <PasswordTab /> : null}
          {profileTab === "6" ? <RiskAssessmentsTab /> : null}
          {profileTab === "7" ? <CommunicationTab investorProfile={investorProfile.data} /> : null}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
});

export default React.memo(Profile);
