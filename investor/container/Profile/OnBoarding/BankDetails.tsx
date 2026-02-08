import React, { useCallback, useContext, useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import {
  RootStateType,
  ThemeContext,
  useGetInvestorProfileQuery,
  usePostBankAccountMutation,
  usePostFileBase64Mutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, FlexRow, getInvestorPayload, Padding, Typography } from "@niveshstar/ui";

import BankQuestion from "../../../components/Profile/OnBoard/BankDetails/BankQuestion";
import Progress from "../../../components/Profile/OnBoard/ProgressBar";

const defaultValues = {
  bank_account: {
    account_holder_name: "",
    account_number: "",
    bank_type: { value: "", name: "" },
    ifsc_code: "",
    branch_name: "",
    bank_name: "",
    branch_address: "",
    cancelled_cheque: "",
    bank_owner: "SELF",
  },
};

function BankDetails() {
  const { navigator } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [postBankApi, { isLoading: isPostingBank }] = usePostBankAccountMutation();
  const [postFileBase64Api, { isLoading: isPostingFile }] = usePostFileBase64Mutation();

  const { data: investorProfile = { data: null }, isLoading: isGettingInvestorProfile } = useGetInvestorProfileQuery(
    undefined,
    {
      skip: !authDetail.id,
    }
  );

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onChange",
    mode: "all",
  });

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = await getInvestorPayload(data, "BANK");

        if (payload.cancelled_cheque) {
          const imgRes = await postFileBase64Api({ investorId: undefined, payload: payload.cancelled_cheque }).unwrap();

          payload.bank.cancelled_cheque_id = imgRes.data.id;
        }

        await postBankApi({ investorId: undefined, payload: payload.bank }).unwrap();
        navigator.replace("profile", "main");
      } catch {
        //pass
      }
    },
    [postBankApi, postFileBase64Api, navigator]
  );

  useEffect(() => {
    if (!investorProfile || !investorProfile.data) return;
    setValue(
      "bank_account.account_holder_name",
      [investorProfile.data?.first_name, investorProfile.data?.middle_name, investorProfile.data?.last_name]
        .filter(Boolean)
        .join(" ")
    );
  }, [investorProfile, setValue]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <View style={styles.wrapper}>
        <Progress percent={90} />
        <Padding height={24} />

        {isGettingInvestorProfile ? (
          <View style={{ flexGrow: 1, justifyContent: "center" }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </View>
        ) : null}

        {isGettingInvestorProfile || !investorProfile.data ? null : (
          <>
            <Typography size="3" weight="medium">
              Bank Details
            </Typography>
            <Padding height={24} />

            <BankQuestion control={control} setValue={setValue} data={investorProfile.data} />
            <Padding height={24} />

            <FlexRow justifyContent="center" colGap={16}>
              <Button disabled icon={<Entypo name="chevron-left" size={30} color={themeColor.accent[6]} />} />
              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isPostingFile || isPostingBank}
                icon={
                  <Entypo
                    name="chevron-right"
                    size={30}
                    color={isPostingFile || isPostingBank ? themeColor.accent[6] : themeColor.gray[1]}
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

export default React.memo(BankDetails);
