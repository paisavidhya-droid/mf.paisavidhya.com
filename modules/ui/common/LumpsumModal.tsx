import React from "react";
import { View } from "react-native";
import { Control } from "react-hook-form";

import ControlledDropDown from "../ControlledDropDown";
import ControlledInput from "../ControlledInput";
import Padding from "../Padding";

interface PropsType {
  control: Control<any>;
  folioOptions: { name: string; value: string }[];
}

export default function LumpsumModal(props: PropsType) {
  const { control, folioOptions } = props;

  return (
    <View>
      <ControlledInput label="Scheme Name" name="from_scheme" control={control} placeholder="Select Scheme" disabled />

      <ControlledDropDown
        control={control}
        label="Folio"
        name="folio"
        placeholder="Select Folio"
        options={folioOptions}
        rules={{
          required: {
            value: true,
            message: "Please select folio",
          },
        }}
      />
      <Padding height={16} />

      <ControlledInput
        control={control}
        name="amount"
        placeholder="Enter amount"
        label="Purchase Amount"
        inputMode="numeric"
        keyboardType="number-pad"
        rules={{
          required: {
            value: true,
            message: "Please enter amount",
          },
        }}
      />
      <Padding height={16} />
    </View>
  );
}
