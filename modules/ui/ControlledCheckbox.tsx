import React from "react";
import { View } from "react-native";
import { Control, Controller } from "react-hook-form";

import InputCheckbox from "./InputCheckbox";

interface PropsType {
  name: string;
  label: string;
  control: Control<any>;
  disabled?: boolean;
}

function ControlledCheckbox(props: PropsType) {
  const { label, name, control, disabled = false } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View>
          <InputCheckbox label={label} checked={value} disabled={disabled} onChange={() => onChange(!value)} />
        </View>
      )}
    />
  );
}

export default React.memo(ControlledCheckbox);
