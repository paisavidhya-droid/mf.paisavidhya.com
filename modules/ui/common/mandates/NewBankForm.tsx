import React from "react";
import { Control } from "react-hook-form";

import { bankAccountTypeOptions, numberRegex } from "@niveshstar/constant";

import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import IfscInput from "../../IfscInput";
import Padding from "../../Padding";

interface PropsType {
  control: Control<any>;
  setValue: (name: string, value: any) => void;
}

export default function NewBankForm(props: PropsType) {
  const { control, setValue } = props;
  return (
    <>
      <ControlledInput
        label="Account Number"
        name="account_number"
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
        label="Account Type"
        name="type"
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

      <IfscInput control={control} setValue={setValue} />
    </>
  );
}
