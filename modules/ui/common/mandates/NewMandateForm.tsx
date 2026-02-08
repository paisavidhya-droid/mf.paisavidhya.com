import React, { useCallback, useEffect, useState } from "react";
import { Control, useForm, UseFormSetValue } from "react-hook-form";
import { useSelector } from "react-redux";

import { mandateLimitOptions, mandateTypeOptions, upiIdRegex } from "@niveshstar/constant";
import { RootStateType, useGetAllBankAccountQuery, usePostBankAccountMutation } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import Button from "../../Button";
import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import ControlledRadio from "../../ControlledRadio";
import CustomModal from "../../CustomModal";
import Padding from "../../Padding";
import NewBankForm from "./NewBankForm";

interface PropsType {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  mandateType: string;
}

const defaultValues = {
  account_number: "",
  ifsc_code: "",
  type: { name: "", value: "" },
  branch_name: "",
  bank_name: "",
  branch_address: "",
};

export default function NewMandateForm(props: PropsType) {
  const { control, setValue, mandateType } = props;
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const { params } = useNavigation();
  const [bankDropDownOptions, setBankDropDownOptions] = useState([]);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);
  const [isCustomLismitVisible, setIsCustomLimitVisible] = useState(false);

  const [postBankAccountApi, { isLoading: isPostingBankAccount }] = usePostBankAccountMutation();
  const { data: bankAccountData = [], isLoading: isGettingBankAccountList } = useGetAllBankAccountQuery(
    authDetail.userType === "investor" ? undefined : params.investorId,
    {
      skip: !authDetail.id,
    }
  );

  const {
    control: bankControl,
    handleSubmit,
    setValue: setBankValue,
    reset,
  } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onChange",
    mode: "all",
  });

  const openBankModal = useCallback(() => {
    setIsBankModalVisible(true);
  }, []);
  const closeBankModal = useCallback(() => {
    setIsBankModalVisible(false);
    reset();
  }, [reset]);

  const showCustomLimit = useCallback(() => {
    setIsCustomLimitVisible(true);
    setValue("limit", { name: "", value: "" });
  }, [setValue]);

  const hideCustomLimit = useCallback(() => {
    setIsCustomLimitVisible(false);
    setValue("custom_limit", "");
  }, [setValue]);

  const onBankSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          ...data,
          type: data.type.value,
        };
        await postBankAccountApi(payload).unwrap();
        closeBankModal();
      } catch {
        //pass
      }
    },
    [postBankAccountApi, closeBankModal]
  );

  useEffect(() => {
    if (bankAccountData.length === 0) return;
    const tempOptions = bankAccountData.map((val: any) => ({
      name: `${val.bank_name} - Acc No. ${val.account_number}`,
      value: val.id,
    }));
    setBankDropDownOptions(tempOptions);
  }, [bankAccountData]);

  return (
    <>
      <ControlledDropDown
        control={control}
        name="bank_account"
        label="Bank Account"
        options={bankDropDownOptions}
        placeholder="Select Bank Account"
        isLoading={isGettingBankAccountList}
        rules={{
          required: {
            value: true,
            message: "Please select bank account",
          },
        }}
      />
      <Padding height={16} />

      <Button variant="outline" title="Add new bank account" onPress={openBankModal} />
      <Padding height={16} />

      <ControlledRadio
        name="limit"
        label="Limit"
        control={control}
        options={mandateLimitOptions}
        onChangeCallback={hideCustomLimit}
        optionContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          rowGap: 16,
        }}
        rules={{
          required: {
            value: !isCustomLismitVisible,
            message: "Please select limit",
          },
        }}
      />
      <Padding height={16} />

      {isCustomLismitVisible ? (
        <ControlledInput
          control={control}
          label="Custom Limit"
          placeholder="Enter Custom Limit"
          name="custom_limit"
          rules={{
            required: {
              value: true,
              message: "Please enter limit",
            },
          }}
        />
      ) : (
        <Button variant="outline" title="Set Custom Limit" onPress={showCustomLimit} />
      )}
      <Padding height={16} />

      <ControlledRadio control={control} name="mandate_type" label="Mandate Type" options={mandateTypeOptions} />
      <Padding height={16} />

      {mandateType === "UPI" ? (
        <ControlledInput
          name="upi_id"
          control={control}
          label="UPI Id"
          placeholder="Enter UPI Id"
          rules={{
            required: {
              value: true,
              message: "Please enter UPI id",
            },
            pattern: {
              value: upiIdRegex,
              message: "Invalid UPI ID format",
            },
          }}
        />
      ) : null}

      <CustomModal
        heightPercent={70}
        footerTitle="Add Bank"
        title="Add Bank Details"
        closeModal={closeBankModal}
        isModalVisible={isBankModalVisible}
        onConfirm={handleSubmit(onBankSubmit)}
        primaryBtnProps={{
          disabled: isPostingBankAccount,
          loading: isPostingBankAccount,
        }}
      >
        <NewBankForm control={bankControl} setValue={setBankValue} />
      </CustomModal>
    </>
  );
}
