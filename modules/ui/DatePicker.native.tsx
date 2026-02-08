import React, { useCallback, useContext, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Control, Controller, RegisterOptions } from "react-hook-form";

import { ThemeContext } from "@niveshstar/context";

import InputField from "./InputField";
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
  const {
    name,
    label,
    control,
    placeholder,
    rules = {},
    disabled = false,
    minimumDate = null,
    maximumDate = null,
  } = props;

  const { themeColor } = useContext(ThemeContext);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const showDatePicker = useCallback(() => {
    setIsDatePickerVisible(true);
  }, []);

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
          <View style={styles.container}>
            <Pressable onPress={showDatePicker} style={styles.touchable} disabled={disabled} />
            <InputField error={error} placeholder={placeholder} disabled={disabled} value={value} />
          </View>
          {isDatePickerVisible ? (
            <DateTimePicker
              value={new Date(value ? value : null)}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              mode={"date"}
              disabled={disabled}
              onChange={(e, newDate) => {
                if (e.type === "dismissed") {
                  setIsDatePickerVisible(false);
                  return;
                }

                onChange(newDate.toLocaleDateString());
                setIsDatePickerVisible(false);
              }}
            />
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  touchable: {
    position: "absolute",
    top: 0,
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
    borderRadius: 12,
    zIndex: 2,
  },
});

export default React.memo(DatePicker);
