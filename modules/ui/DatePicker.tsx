import React, { useContext, useState } from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import { Control, Controller, RegisterOptions } from "react-hook-form";

import { ThemeContext } from "@niveshstar/context";

import Typography from "./Typography";

interface PropsType {
  label?: string;
  control: Control<any>;
  name: string;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
  placeholder: string;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

function DatePicker(props: PropsType) {
  const { name, label, control, placeholder, rules = {}, disabled = false } = props;

  const { themeColor } = useContext(ThemeContext);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
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
          <View
            style={[
              { borderWidth: 3, borderColor: "transparent", borderRadius: 9 },
              isFocused ? (error ? { borderColor: themeColor.red["a7"] } : { borderColor: themeColor.blue["a7"] }) : {},
            ]}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  input.datepicker::placeholder {
                    color: ${disabled ? themeColor.gray[9] : error ? themeColor.red[9] : themeColor.gray[9]};
                  }`,
              }}
            />
            <input
              type="date"
              style={{
                ...inputStyle,
                borderColor: disabled ? themeColor.gray[1] : error ? themeColor.red["a7"] : themeColor.gray[6],
                color: disabled ? themeColor.gray[8] : themeColor.gray[12],
                background: disabled ? themeColor.gray[3] : themeColor.gray[1],
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              value={value}
              className="datepicker"
              onChange={onChange}
              disabled={disabled}
            />
          </View>
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

const inputStyle: React.CSSProperties = {
  outline: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  border: "0.8px solid transparent",
  font: '14px "Inter", -apple-system,  BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  lineHeight: "20px",
};

export default React.memo(DatePicker);
