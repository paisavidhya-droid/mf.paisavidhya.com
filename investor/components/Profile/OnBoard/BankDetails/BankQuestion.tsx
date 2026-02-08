import React from "react";
import { Control } from "react-hook-form";

import { bankAccountTypeOptions, numberRegex } from "@niveshstar/constant";
import { ControlledDropDown, ControlledInput, IfscInput, ImagePicker, Padding } from "@niveshstar/ui";

interface PropsType {
  data: any;
  control: Control<any>;
  setValue: (name: string, value: any) => void;
}

export default function BankQuestion(props: PropsType) {
  const { control, setValue, data } = props;

  const taxStatus = data.tax_status;

  const bankTypeOptions = bankAccountTypeOptions.filter((option) => {
    if (taxStatus === "NRE") return option.value === "NRE";
    if (taxStatus === "NRO") return option.value === "NRO";
    return option.value === "SAVINGS_BANK" || option.value === "CURRENT_BANK";
  });

  return (
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
        options={bankTypeOptions}
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
    </>
  );
}
