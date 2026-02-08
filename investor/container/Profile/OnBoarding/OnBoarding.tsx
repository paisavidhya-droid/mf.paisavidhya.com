import React, { useCallback, useContext, useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext, useGetInvestorProfileQuery } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, CustomCard, Divider, FlexRow, Padding, Typography } from "@niveshstar/ui";

function OnBoarding() {
  const { navigator } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const { data: investorProfile = null, isLoading } = useGetInvestorProfileQuery(undefined, {
    skip: !authDetail.id,
  });

  const handleNavigate = useCallback(() => {
    if (!investorProfile || !investorProfile.data || !investorProfile.success) return;

    const panNumber = investorProfile?.data?.pan || "";
    const isCompany = panNumber ? panNumber.toLowerCase()[3] === "c" : false;

    let targetScreen = "";
    let currStep = isCompany ? "2" : "0";

    if (!isCompany && !investorProfile?.data?.occupation) {
      targetScreen = "onboarding/personal-details";
    } else if (!isCompany && !investorProfile?.data?.source_of_wealth) {
      targetScreen = "onboarding/personal-details";
    } else if (!isCompany && !investorProfile?.data?.income_slab) {
      targetScreen = "onboarding/personal-details";
    }
    else if (!isCompany && !investorProfile?.data?.pep_details) {
      targetScreen = "onboarding/personal-details";
      currStep = "1";
    } else if (!isCompany && !investorProfile?.data?.country_of_birth) {
      targetScreen = "onboarding/personal-details";
      currStep = "1";
    } else if (!isCompany && !investorProfile?.data?.place_of_birth) {
      targetScreen = "onboarding/personal-details";
      currStep = "1";
    } else if (!investorProfile?.data.address) {
      targetScreen = "onboarding/personal-details";
      currStep = "2";
    } else if (!isCompany && investorProfile?.data.related_party?.length === 0) {
      targetScreen = "onboarding/nominee-details";
    } else if (investorProfile?.data.bank_account?.length === 0) {
      targetScreen = "onboarding/bank-details";
    } else if (isCompany && !investorProfile?.data?.pancard_list) {
      targetScreen = "onboarding/company-details";
    } else if (!investorProfile?.data?.signature) {
      targetScreen = "onboarding/sign-details";
    }

    navigator.navigate("profile", targetScreen, { step: currStep });
  }, [investorProfile, navigator]);

  useEffect(() => {
    // handleNavigate();
  }, [handleNavigate]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      {isLoading ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {!isLoading ? (
        <CustomCard style={{ maxWidth: 600, marginHorizontal: "auto" }}>
          <FlexRow>
            <AntDesign name="warning" size={24} color={themeColor.yellow[10]} />
            <Padding width={16} />
            <Typography size="3" weight="medium">
              Please take 5 mins to complete your profile.
            </Typography>
          </FlexRow>
          <Padding height={24} />
          <Typography size="3" weight="medium">
            Account Setup
          </Typography>
          <Padding height={24} />

          <FlexRow alignItems="center">
            <AntDesign name="check-circle" size={20} color={themeColor.green[9]} />
            <Padding height={16} />
            <Typography>Signup</Typography>
          </FlexRow>

          <Padding height={16} />
          <Divider />
          <Padding height={16} />

          <FlexRow alignItems="center">
            {investorProfile?.data?.address ? (
              <AntDesign name="check-circle" size={20} color={themeColor.green[9]} />
            ) : (
              <AntDesign name="exclamation-circle" size={20} color={themeColor.yellow[10]} />
            )}
            <Padding width={16} />
            <Typography>Personal Profile</Typography>
          </FlexRow>

          <Padding height={16} />
          <Divider />
          <Padding height={16} />

          <FlexRow alignItems="center">
            {investorProfile?.data?.related_party?.length !== 0 ? (
              <AntDesign name="check-circle" size={20} color={themeColor.green[9]} />
            ) : (
              <AntDesign name="exclamation-circle" size={20} color={themeColor.yellow[10]} />
            )}
            <Padding height={16} />
            <Typography>Nominee Details</Typography>
          </FlexRow>

          <Padding height={16} />
          <Divider />
          <Padding height={16} />

          <FlexRow alignItems="center">
            {investorProfile?.data?.bank_account?.length !== 0 ? (
              <AntDesign name="check-circle" size={20} color={themeColor.green[9]} />
            ) : (
              <AntDesign name="exclamation-circle" size={20} color={themeColor.yellow[10]} />
            )}
            <Padding height={16} />
            <Typography>Bank Details</Typography>
          </FlexRow>

          <Padding height={16} />
          <Divider />
          <Padding height={16} />

          <FlexRow alignItems="center">
            {investorProfile?.data?.signature ? (
              <AntDesign name="check-circle" size={20} color={themeColor.green[9]} />
            ) : (
              <AntDesign name="exclamation-circle" size={20} color={themeColor.yellow[10]} />
            )}
            <Padding width={8} />
            <Typography>Digital Sign</Typography>
          </FlexRow>

          <Padding height={24} />

          <Button onPress={handleNavigate} title="Complete Profile" />
        </CustomCard>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
});

export default React.memo(OnBoarding);
