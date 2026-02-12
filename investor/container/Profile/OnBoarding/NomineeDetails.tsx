import React, { useCallback, useContext } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import {
  RootStateType,
  ThemeContext,
  useGetInvestorProfileQuery,
  usePostIdentifierMutation,
  usePostRelatedPartyMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, FlexRow, getInvestorPayload, Padding, Typography } from "@niveshstar/ui";
import { getNamesPart } from "@niveshstar/utils";

import NomineeQuestion from "../../../components/Profile/OnBoard/NomineeDetails/NomineeQuestion";
import Progress from "../../../components/Profile/OnBoard/ProgressBar";

const defaultValues = {
  nominee: {
    name: "",
    date_of_birth: "",
    relationship: { name: "", value: "" },
    nomination_percent: "100",
    identity_type: { value: "", name: "" },
    pan: "",
    adhaar: "",
    driving_license: "",
    email: "",
    mobile: "",
    line1: "",
    line2: "",
    line3: "",
    city: "",
    state: { name: "", value: "" },
    postal_code: "",
    country: { name: "", value: "" },
  },
};

function NomineeDetails() {
  const { navigator } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [postRelatedPartyApi, { isLoading: isPostingRelatedParty }] = usePostRelatedPartyMutation();
  const [postIdentifierApi, { isLoading: isPostingIdentifier }] = usePostIdentifierMutation();

  const { data: investorProfile = { data: null }, isLoading: isGettingInvestorProfile } = useGetInvestorProfileQuery(
    undefined,
    {
      skip: !authDetail.id,
    }
  );

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const identityType = watch("nominee.identity_type");

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const { first_name, middle_name, last_name } = getNamesPart(data.nominee.name);

        //@ts-ignore
        data.nominee.first_name = first_name;
        //@ts-ignore
        data.nominee.middle_name = middle_name;
        //@ts-ignore
        data.nominee.last_name = last_name;

        const payload = await getInvestorPayload(data, "NOMINEE");

        const res = await postRelatedPartyApi({ investorId: undefined, payload: payload.nominee }).unwrap();

        payload.identifier.related_party_id = res.data.id;
        await postIdentifierApi({ investorId: undefined, payload: payload.identifier }).unwrap();

        navigator.replace("profile", "main");
      } catch {
        //pass
      }
    },
    [postRelatedPartyApi, navigator, postIdentifierApi]
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <View style={styles.wrapper}>
        <Progress percent={80} />
        <Padding height={24} />

        {isGettingInvestorProfile ? (
          <View style={{ flexGrow: 1, justifyContent: "center" }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </View>
        ) : null}

        {isGettingInvestorProfile || !investorProfile.data ? null : (
          <>
            <Typography size="3" weight="medium">
              Nominee Details
            </Typography>
            <Padding height={24} />

            <NomineeQuestion
              control={control}
              setValue={setValue}
              identityType={identityType}
              data={investorProfile.data}
            />
            <Padding height={24} />

            <FlexRow justifyContent="center" colGap={16}>
              <Button disabled icon={<Entypo name="chevron-left" size={30} color={themeColor.accent[6]} />} />
              <Button
                disabled={isPostingRelatedParty || isPostingIdentifier}
                onPress={handleSubmit(onSubmit)}
                icon={
                  <Entypo
                    name="chevron-right"
                    size={30}
                    color={isPostingRelatedParty || isPostingIdentifier ? themeColor.accent[6] : themeColor.gray[1]}
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

export default React.memo(NomineeDetails);
