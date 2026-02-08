import React from "react";
import { View } from "react-native";
import { Control } from "react-hook-form";

import ControlledDropDown from "../ControlledDropDown";
import ControlledInput from "../ControlledInput";
import ControlledRadio from "../ControlledRadio";
import Padding from "../Padding";

interface PropsType {
  control: Control<any>;
  redemptionBy: string;
  folioOptions: { name: string; value: string }[];
}

function RedeemModal(props: PropsType) {
  const { control, redemptionBy, folioOptions } = props;

  return (
    <View>
      <ControlledInput label="From Scheme" name="from_scheme" control={control} placeholder="Select Scheme" disabled />

      <Padding height={8} />

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
        name="redemption_by"
        label="Select redemption by"
        options={[
          { name: "All Units", value: "all-units" },
          { name: "Lock/Load Free Units", value: "free-units" },
          { name: "Amount", value: "amount" },
        ]}
        rules={{
          required: {
            value: true,
            message: "Please select redemption by",
          },
        }}
      />

      <Padding height={16} />

      <ControlledInput
        label="Redemption Amount"
        name="amount"
        control={control}
        placeholder="Enter Redemption Amount"
        disabled={redemptionBy !== "amount"}
      />
    </View>
  );
}

export default React.memo(RedeemModal);
