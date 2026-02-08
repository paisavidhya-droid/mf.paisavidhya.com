import React from "react";
import { View } from "react-native";
import moment from "moment";
import { Control } from "react-hook-form";

import { frequencyOptions } from "@niveshstar/constant";

import ControlledCheckbox from "../ControlledCheckbox";
import ControlledDropDown from "../ControlledDropDown";
import ControlledInput from "../ControlledInput";
import DatePicker from "../DatePicker";
import Padding from "../Padding";
import SchemeDropDown from "../SchemeDropDown";

interface PropsType {
  isin?: string;
  control: Control<any>;
  folioOptions: { name: string; value: string }[];
}

function STPModal(props: PropsType) {
  const { control, folioOptions, isin } = props;

  return (
    <View>
      <ControlledInput label="From Scheme" name="from_scheme" control={control} placeholder="From Scheme" disabled />

      <Padding height={8} />

      <SchemeDropDown control={control} name="to_scheme" isin={isin} orderType="stp" />

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

      <ControlledInput
        control={control}
        name="amount"
        placeholder="Enter amount"
        label="Installment Amount"
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

      <ControlledInput
        control={control}
        name="installment_count"
        placeholder="Enter installment count"
        label="Installment Count"
        inputMode="numeric"
        keyboardType="number-pad"
        rules={{
          required: {
            value: true,
            message: "Please enter installment count",
          },
        }}
      />

      <Padding height={16} />

      <ControlledDropDown
        control={control}
        name="frequency"
        placeholder="Select frequency"
        label="Frequency"
        options={frequencyOptions}
        rules={{
          required: {
            value: true,
            message: "Please select frequency",
          },
        }}
      />

      <Padding height={16} />

      <DatePicker
        control={control}
        name="start_date"
        label="Start Date"
        placeholder="Start Date"
        rules={{
          required: {
            value: true,
            message: "Please select frequency",
          },
          validate: (value: string) => {
            if (!value) return true;
            const selectedDate = moment(value, "YYYY-MM-DD").startOf("day");
            const today = moment().startOf("day");
            if (selectedDate.isBefore(today)) {
              return "Please select a date after today";
            }
            return true;
          },
        }}
      />

      <Padding height={16} />

      <ControlledCheckbox control={control} name="first_order_today" label="First Order Today" />
    </View>
  );
}

export default React.memo(STPModal);
