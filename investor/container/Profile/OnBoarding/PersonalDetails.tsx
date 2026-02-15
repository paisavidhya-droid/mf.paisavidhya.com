import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import {
  RootStateType,
  ThemeContext,
  useGetInvestorProfileQuery,
  usePatchInvestorProfileMutation,
  usePostAddressMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, FlexRow, Padding } from "@niveshstar/ui";

import PersonalQuestion from "../../../components/Profile/OnBoard/PersonalDetails/PersonalQuestion";
import ProgressBar from "../../../components/Profile/OnBoard/ProgressBar";

const defaultValues = {
  place_of_birth: "",
  occupation: { name: "", value: "" },
  source_of_wealth: { name: "", value: "" },
  pep_details: { name: "", value: "" },
  income_slab: { name: "", value: "" },
  country_of_birth: { name: "", value: "" },
  tax_status: { name: "", value: "" },
  tin_no: "",
  tin_country: { name: "", value: "" },
  address: {
    line1: "",
    line2: "",
    country: { name: "", value: "" },
    postal_code: "",
    city: "",
    state: { name: "", value: "" },
    foreign_state: "",
    type: { name: "Residential", value: "RESIDENTIAL" },
  },
};

function PersonalDetails() {
  const { navigator, params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);
  const [currStep, setCurrStep] = useState(parseInt(params?.step || "0"));

  const maxStep = 3;
  const percentCompletion = 30 + (50 / maxStep) * currStep;

  const [postAddressApi, { isLoading: isPostingAddress }] = usePostAddressMutation();
  const [patchInvestorProfileApi, { isLoading: isPatchingInvestorProfile }] = usePatchInvestorProfileMutation();

  const { data: investorProfile = { data: null }, isLoading: isGettingInvestorProfile } = useGetInvestorProfileQuery(
    undefined,
    {
      skip: !authDetail.id,
    }
  );

  const { control, handleSubmit } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      const payload: any = {};

      const isForeign = investorProfile.data?.tax_status === "NRE" || investorProfile.data?.tax_status === "NRO";

      switch (currStep) {
        case 0:
          payload.occupation = data.occupation.value;
          payload.source_of_wealth = data.source_of_wealth.value;
          payload.income_slab = data.income_slab.value;
          payload.tax_status = data.tax_status.value;
          break;
        case 1:
          payload.pep_details = data.pep_details.value;
          payload.country_of_birth = data.country_of_birth.value;
          payload.place_of_birth = data.country_of_birth.value;
          payload.tin_no = isForeign ? data.tin_no : undefined;
          payload.tin_country = isForeign ? data.tin_country.value : undefined;
          break;
        case 2:
          payload.line1 = data.address.line1;
          payload.line2 = data.address.line2 ? data.address.line2 : undefined;
          payload.country = isForeign ? data.address.country.value : "IND";
          payload.postal_code = isForeign ? "999999" : data.address.postal_code;
          payload.state = isForeign ? data.address.foreign_state : data.address.state.value;
          payload.city = data.address.city;
          payload.type = data.address.type.value;
          break;
      }

      if (currStep === 2) {
        await postAddressApi({ investorId: undefined, payload }).unwrap();
        navigator.replace("profile", "onboarding/holder-details");
      } else {
        await patchInvestorProfileApi({ investorId: undefined, payload }).unwrap();
        setCurrStep(currStep + 1);
      }
    },
    [postAddressApi, patchInvestorProfileApi, currStep, navigator, investorProfile]
  );

  const handlePrev = useCallback(() => {
    setCurrStep((curr) => Math.max(curr - 1, 0));
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <View style={styles.wrapper}>
        <ProgressBar percent={percentCompletion} />

        <Padding height={24} />

        {isGettingInvestorProfile ? (
          <View style={{ flexGrow: 1, justifyContent: "center" }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </View>
        ) : null}

        {isGettingInvestorProfile || !investorProfile.data ? null : (
          <>
            <PersonalQuestion control={control} currStep={currStep} data={investorProfile.data} />

            <Padding height={24} />

            <FlexRow justifyContent="center" colGap={16}>
              <Button
                disabled={currStep === 0 || isPostingAddress || isPatchingInvestorProfile}
                onPress={handlePrev}
                icon={
                  <Entypo
                    name="chevron-left"
                    size={30}
                    color={currStep == 0 ? themeColor.accent[6] : themeColor.gray[1]}
                  />
                }
              />
              <Button
                disabled={currStep === maxStep || isPostingAddress || isPatchingInvestorProfile}
                onPress={handleSubmit(onSubmit)}
                icon={
                  <Entypo
                    name="chevron-right"
                    size={30}
                    color={currStep == maxStep ? themeColor.accent[6] : themeColor.gray[1]}
                  />
                }
              />
            </FlexRow>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  wrapper: {
    flexGrow: 1,
    padding: 12,
    maxWidth: 400,
    width: "100%",
    margin: "auto",
  },
});

export default React.memo(PersonalDetails);