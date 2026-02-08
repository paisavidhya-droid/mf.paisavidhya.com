import React, { useContext, useMemo, useState } from "react";
import { Pressable, StyleProp, TextInputProps, View, ViewStyle } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Control, Controller, RegisterOptions } from "react-hook-form";

import { ThemeContext } from "@niveshstar/context";

import InputField from "./InputField";
import Typography from "./Typography";

interface PropsType extends TextInputProps {
  name: string;
  label?: string;
  disabled?: boolean;
  control: Control<any>;
  inputStyle?: StyleProp<ViewStyle>;
  subtitleContent?: React.ReactNode;
  inputExtraContent?: React.ReactNode;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
}

function ControlledInput(props: PropsType) {
  const { name, label, control, placeholder, rules = {}, secureTextEntry = false, ...rest } = props;

  const { themeColor } = useContext(ThemeContext);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  const eyeButton = useMemo(
    () => (
      <View
        style={{
          position: "absolute",
          right: 14,
          top: 10,
          zIndex: 1,
        }}
      >
        <Pressable
          hitSlop={10}
          onPress={() => setHidePassword(!hidePassword)}
          disabled={props.disabled}
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
          })}
        >
          {hidePassword ? (
            <Entypo name="eye-with-line" size={16} color={props.disabled ? themeColor.gray[8] : themeColor.gray[11]} />
          ) : (
            <AntDesign name="eye" size={18} color={props.disabled ? themeColor.gray[8] : themeColor.gray[11]} />
          )}
        </Pressable>
      </View>
    ),
    [hidePassword, props.disabled, themeColor]
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        return (
          <View>
            {label ? (
              <Typography style={{ marginBottom: 4 }}>
                {label}
                {typeof rules.required === "object" && rules.required.value ? (
                  <Typography color={themeColor.red[11]}> *</Typography>
                ) : null}
              </Typography>
            ) : null}
            <InputField
              error={error}
              onChangeText={(val) => {
                if (props.inputMode === "numeric" || props.inputMode === "decimal") {
                  const num = Number(val);
                  if (isNaN(num)) return;
                }
                if (
                  typeof rules.maxLength === "object" &&
                  rules?.maxLength?.value &&
                  val.length > rules?.maxLength?.value
                ) {
                  return;
                }
                onChange(val);
              }}
              fieldRef={ref}
              placeholder={placeholder}
              value={value}
              disabled={props.disabled}
              extraContent={props.secureTextEntry ? eyeButton : props.inputExtraContent}
              style={props.inputStyle}
              secureTextEntry={secureTextEntry ? hidePassword : false}
              {...rest}
            />
          </View>
        );
      }}
    />
  );
}

export default React.memo(ControlledInput);
