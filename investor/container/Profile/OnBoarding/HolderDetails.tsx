import React, { useCallback, useContext } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import {
  RootStateType,
  ThemeContext,
  useGetInvestorProfileQuery,
  usePostHolderMutation,
  usePostIdentifierMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, FlexRow, getInvestorPayload, Padding, Typography } from "@niveshstar/ui";
import { getNamesPart } from "@niveshstar/utils";

import HolderQuestion from "../../../components/Profile/OnBoard/HolderDetails/HolderQuestion";
import ProgressBar from "../../../components/Profile/OnBoard/ProgressBar";

const defaultValues = {
  holder: {
    name: "",
    gender: { name: "", value: "" },
    holder_rank: { name: "Second", value: "SECOND" },
    date_of_birth: "",
    place_of_birth: "",
    country_of_birth: { name: "", value: "" },
    occupation: { name: "", value: "" },
    source_of_wealth: { name: "", value: "" },
    income_slab: { name: "", value: "" },
    pep_details: { name: "", value: "" },
    email: "",
    mobile: "",
    identity_type: { value: "PAN", name: "Pan" },
    pan: "",
  },
};

function HolderDetails() {
  const { navigator } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [postHolderApi, { isLoading: isPostingHolder }] = usePostHolderMutation();
  const [postIdentifierApi, { isLoading: isPostingIdentifier }] = usePostIdentifierMutation();

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
      try {
        const { first_name, middle_name, last_name } = getNamesPart(data.holder.name);

        //@ts-ignore
        data.holder.first_name = first_name;
        //@ts-ignore
        data.holder.middle_name = middle_name;
        //@ts-ignore
        data.holder.last_name = last_name;

        const payload = await getInvestorPayload(data, "HOLDER");

        const res = await postHolderApi(payload.holder).unwrap();

        payload.identifier.holder_id = res.data.id;
        await postIdentifierApi({ investorId: undefined, payload: payload.identifier }).unwrap();

        navigator.replace("profile", "onboarding/nominee-details");
      } catch {
        // Handle error
      }
    },
    [postHolderApi, postIdentifierApi, navigator]
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <View style={styles.wrapper}>
        <ProgressBar percent={60} />

        <Padding height={24} />

        {isGettingInvestorProfile ? (
          <View style={{ flexGrow: 1, justifyContent: "center" }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </View>
        ) : null}

        {isGettingInvestorProfile || !investorProfile.data ? null : (
          <>
            <FlexRow justifyContent="space-between" alignItems="center">
              <Typography size="3" weight="medium">
                Holder Details
              </Typography>
              <Button
                title="Skip"
                variant="ghost"
                onPress={() => navigator.replace("profile", "onboarding/nominee-details")}
                disabled={isPostingHolder}
              />
            </FlexRow>

            <Padding height={24} />

            <HolderQuestion control={control} holders={investorProfile.data?.holder || []} />

            <Padding height={24} />

            <FlexRow justifyContent="center" colGap={16}>
              <Button disabled icon={<Entypo name="chevron-left" size={30} color={themeColor.accent[6]} />} />
              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isPostingIdentifier || isPostingHolder}
                icon={
                  <Entypo
                    name="chevron-right"
                    size={30}
                    color={isPostingIdentifier || isPostingHolder ? themeColor.accent[6] : themeColor.gray[1]}
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

export default React.memo(HolderDetails);