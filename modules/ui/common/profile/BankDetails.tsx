import React, { useCallback, useContext, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";

import { bankAccountTypeOptions, colors, numberRegex } from "@niveshstar/constant";
import {
  ThemeContext,
  usePatchBankAccountMutation,
  usePostBankAccountMutation,
  usePostFileBase64Mutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import Button from "../../Button";
import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import FlexRow from "../../FlexRow";
import IfscInput from "../../IfscInput";
import ImagePicker from "../../ImagePicker";
import Padding from "../../Padding";
import Typography from "../../Typography";
import { getInvestorPayload } from "../payload";
import { updateInvestorForm } from "../util";

interface PropsType {
  investorProfile: any;
}

const defaultValues = {
  bank_account: {
    account_holder_name: "",
    account_number: "",
    bank_type: { name: "", value: "" },
    ifsc_code: "",
    branch_name: "",
    bank_name: "",
    bank_owner: "SELF",
    branch_address: "",
    cancelled_cheque: "",
    mobile: "",
    email: "",
  },
};

function BankDetails(props: PropsType) {
  const { investorProfile } = props;
  const bankDetails = investorProfile?.bank_account?.[0] || null;

  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);

  const [postBankApi, { isLoading: isPostingBank }] = usePostBankAccountMutation();
  const [postFileBase64Api, { isLoading: isPostingFile }] = usePostFileBase64Mutation();
  const [patchBankApi, { isLoading: isPatchingBank }] = usePatchBankAccountMutation();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onChange",
    mode: "all",
  });

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);
  const handleCancelClick = useCallback(() => {
    setIsEditing(false);
  }, []);

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = await getInvestorPayload(data, "BANK");

        if (payload.cancelled_cheque) {
          const imgRes = await postFileBase64Api({
            investorId: params.investorId,
            payload: payload.cancelled_cheque,
          }).unwrap();

          payload.bank.cancelled_cheque_id = imgRes.data.id;
        }

        if (bankDetails) await patchBankApi({ id: bankDetails.id, payload: payload.bank }).unwrap();
        else await postBankApi({ investorId: params.investorId, payload: payload.bank }).unwrap();

        handleCancelClick();
      } catch {
        // pass
      }
    },
    [patchBankApi, handleCancelClick, postBankApi, postFileBase64Api, bankDetails, params]
  );

  useEffect(() => {
    if (!investorProfile) return;
    updateInvestorForm(investorProfile, setValue, "BANK");
  }, [investorProfile, setValue]);

  return (
    <View>
      {isEditing ? (
        <>
          <ControlledInput
            key="account_holder_name"
            label="Account Holder Name"
            name="bank_account.account_holder_name"
            control={control}
            placeholder="Enter name of account holder"
            rules={{
              required: {
                value: true,
                message: "Please enter a name",
              },
            }}
          />

          <Padding height={16} />
          <ControlledInput
            key="account_number"
            label="Account Number"
            name="bank_account.account_number"
            control={control}
            placeholder="Enter account number"
            inputMode="numeric"
            keyboardType="number-pad"
            rules={{
              required: {
                value: true,
                message: "Please enter an account number",
              },
              pattern: {
                value: numberRegex,
                message: "Please enter a valid number",
              },
            }}
          />

          <Padding height={16} />
          <ControlledDropDown
            key="bank_type"
            label="Account Type"
            name="bank_account.bank_type"
            control={control}
            placeholder="Select account type"
            options={bankAccountTypeOptions}
            rules={{
              required: {
                value: true,
                message: "Please select account type",
              },
            }}
          />

          <Padding height={16} />

          <IfscInput
            control={control}
            setValue={setValue}
            ifsc_code="bank_account.ifsc_code"
            bank_name="bank_account.bank_name"
            branch_name="bank_account.branch_name"
            branch_address="bank_account.branch_address"
          />

          <Padding height={16} />

          <ImagePicker
            control={control}
            name="bank_account.cancelled_cheque"
            label="Upload Cancelled Cheque"
            title="Select Cheque"
            imageProps={{
              style: {
                width: "100%",
                minHeight: 150,
                maxHeight: 200,
              },
            }}
            rules={{
              required: {
                value: false,
                message: "Please upload a Cancelled Cheque",
              },
            }}
          />

          <FlexRow justifyContent="flex-end" colGap={8}>
            <Button
              title="Cancel"
              variant="soft"
              color="neutral"
              onPress={handleCancelClick}
              disabled={isPostingBank || isPatchingBank || isPostingFile}
            />
            <Button
              title="Save"
              onPress={handleSubmit(onSubmit)}
              disabled={isPostingBank || isPatchingBank || isPostingFile}
              loading={isPostingBank || isPatchingBank || isPostingFile}
            />
          </FlexRow>
        </>
      ) : (
        <>
          <FlexRow justifyContent="space-between">
            <Typography size="5" weight="medium">
              Bank Details
            </Typography>
            <Button
              variant="soft"
              title={bankDetails ? "Edit" : "Add"}
              onPress={handleEditClick}
              disabled={Boolean(investorProfile.client_code)}
            />
          </FlexRow>
          <Padding height={16} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Holder Name:&nbsp;
            </Typography>
            <Typography size="1">{bankDetails?.account_holder_name || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Account Number:&nbsp;
            </Typography>
            <Typography size="1">{bankDetails?.account_number || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              IFSC Code:&nbsp;
            </Typography>
            <Typography size="1">{bankDetails?.ifsc_code || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Bank Name:&nbsp;
            </Typography>
            <Typography size="1">{bankDetails?.bank_name || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Branch Name:&nbsp;
            </Typography>
            <Typography size="1">{bankDetails?.branch_name || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Branch Address:&nbsp;
            </Typography>
            <Typography size="1">{bankDetails?.branch_address || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Branch City:&nbsp;
            </Typography>
            <Typography size="1">{bankDetails?.branch_city || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Branch District:&nbsp;
            </Typography>
            <Typography size="1">{bankDetails?.branch_district || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Branch State:&nbsp;
            </Typography>
            <Typography size="1">{bankDetails?.branch_state || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Bank Type:&nbsp;
            </Typography>
            <Typography size="1">{bankDetails?.bank_type || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Cancelled Cheque:&nbsp;
            </Typography>
            <Typography size="1">
              {bankDetails?.cancelled_cheque ? (
                <Image
                  source={{ uri: bankDetails?.cancelled_cheque }}
                  style={styles.img}
                  resizeMode="stretch"
                  resizeMethod="resize"
                />
              ) : (
                "-"
              )}
            </Typography>
          </FlexRow>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    backgroundColor: colors.white,
    borderRadius: 5,
    width: 200,
    height: 100,
  },
});

export default React.memo(BankDetails);
