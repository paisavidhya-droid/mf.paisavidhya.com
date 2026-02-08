import React from "react";
import { View } from "react-native";
import { Control } from "react-hook-form";

import ControlledDropDown from "../ControlledDropDown";
import ControlledInput from "../ControlledInput";
import ControlledRadio from "../ControlledRadio";
import Padding from "../Padding";
import SchemeDropDown from "../SchemeDropDown";

interface PropsType {
  isin?: string;
  switchBy: string;
  control: Control<any>;
  folioOptions: { name: string; value: string }[];
}

function SwitchModal(props: PropsType) {
  const { control, switchBy, folioOptions, isin } = props;

  return (
    <View>
      <ControlledInput label="From Scheme" name="from_scheme" control={control} placeholder="From Scheme" disabled />

      <Padding height={8} />

      <SchemeDropDown isin={isin} name="to_scheme" control={control} orderType="switch" />

      <Padding height={16} />

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

      <ControlledRadio
        control={control}
        name="switch_by"
        label="Select switch by"
        options={[
          { name: "All Units", value: "all-units" },
          { name: "Lock/Load Free Units", value: "free-units" },
          { name: "Amount", value: "amount" },
        ]}
        rules={{
          required: {
            value: true,
            message: "Please select switch by",
          },
        }}
      />

      <Padding height={16} />

      <ControlledInput
        label="Switch Amount"
        name="amount"
        control={control}
        placeholder="Enter Switch Amount"
        disabled={switchBy !== "amount"}
      />
    </View>
  );
}

export default React.memo(SwitchModal);
