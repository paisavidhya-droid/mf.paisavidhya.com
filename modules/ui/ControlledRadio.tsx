import React, { useContext } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { MotiView } from "moti";
import { Control, Controller, RegisterOptions } from "react-hook-form";

import { ThemeContext } from "@niveshstar/context";

import FlexRow from "./FlexRow";
import InputRadio from "./InputRadio";
import Typography from "./Typography";

interface optionsType {
  value: string;
  name: string;
  disabled?: boolean;
}

interface PropsType {
  name: string;
  label?: string;
  disabled?: boolean;
  control: Control<any>;
  options: optionsType[];
  onChangeCallback?: (e: any) => void;
  optionContainerStyle?: StyleProp<ViewStyle>;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
}

function ControlledRadio(props: PropsType) {
  const {
    label,
    options,
    name,
    control,
    rules = {},
    onChangeCallback,
    disabled = false,
    optionContainerStyle = {},
  } = props;

  const { themeColor } = useContext(ThemeContext);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...rules,
        validate: (v: optionsType) => {
          if (typeof rules?.required === "object" && rules?.required?.value == false) return true;
          if (!v.value && typeof rules.required === "object") return rules?.required?.message;
          if (!v.value) return "Please select an option";
          return true;
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          {label ? (
            <Typography style={{ marginBottom: 4 }}>
              {label}
              {typeof rules.required === "object" && rules.required.value ? (
                <Typography color={themeColor.red[11]}> *</Typography>
              ) : null}
            </Typography>
          ) : null}
          <FlexRow style={[{ flexDirection: "column" }, optionContainerStyle]} rowGap={8}>
            {options.map((opt, i) => (
              <InputRadio
                label={opt.name}
                checked={value.value === opt.value}
                key={`${name}-${i}`}
                onChange={() => {
                  onChange(opt);
                  if (onChangeCallback) onChangeCallback(opt);
                }}
                disabled={opt.disabled || disabled}
              />
            ))}
          </FlexRow>
          <View style={{ height: 16 }}>
            {error?.message ? (
              <MotiView
                from={{ opacity: 0, translateY: -5 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 300 }}
              >
                <Typography size="1" color={themeColor.red[11]}>
                  {error.message}
                </Typography>
              </MotiView>
            ) : null}
          </View>
        </View>
      )}
    />
  );
}

export default React.memo(ControlledRadio);
