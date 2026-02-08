import React, { useCallback, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPickerExpo from "expo-document-picker";
import { MotiView } from "moti";
import { Control, Controller, RegisterOptions } from "react-hook-form";

import { ThemeContext } from "@niveshstar/context";

import Button, { ButtonPropsType } from "./Button";
import FlexRow from "./FlexRow";
import Padding from "./Padding";
import Typography from "./Typography";

interface PropsType {
  name: string;
  label: string;
  title: string;
  type?: string[];
  disabled?: boolean;
  control: Control<any>;
  exntensionType?: string[];
  labelExtraContent?: React.ReactNode;
  btnProps?: Omit<ButtonPropsType, "title">;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
}

function DocumentPicker(props: PropsType) {
  const {
    name,
    label,
    title,
    control,
    rules = {},
    btnProps = {},
    labelExtraContent,
    type = "application/pdf",
    exntensionType = ["pdf"],
  } = props;

  const { themeColor } = useContext(ThemeContext);

  const handleFileChage = useCallback(
    async (onChange: (e: any) => void) => {
      const result = await DocumentPickerExpo.getDocumentAsync({
        copyToCacheDirectory: true,
        type: type,
        multiple: false,
      });

      if (result.canceled) return;
      onChange(result.assets[0]);
    },
    [type]
  );

  const getFileSize = useCallback((size: number) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...rules,
        validate: (value: any) => {
          if (exntensionType.length === 0) return true;

          const ext = value.name.split(".").at(-1);
          const index = exntensionType.indexOf(ext);

          if (index == -1) return `Please select ${exntensionType.join(", ")} file`;
          return true;
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <FlexRow justifyContent="space-between" alignItems="center">
            <FlexRow alignItems="center" style={{ flexGrow: 1 }}>
              {label ? (
                <Typography style={{ marginBottom: 8 }}>
                  {label}
                  {typeof rules.required === "object" && rules.required.value ? (
                    <Typography color={themeColor.red[11]}> *</Typography>
                  ) : null}
                </Typography>
              ) : null}
              {labelExtraContent ? labelExtraContent : null}
            </FlexRow>
          </FlexRow>
          {!value ? null : (
            <>
              <Padding height={4} />
              <FlexRow alignItems="center" colGap={8}>
                <View style={[styles.extension, { backgroundColor: themeColor.green[3] }]}>
                  <Typography size="1" color={themeColor.green[9]}>
                    {value.name.split(".")[1].toUpperCase()}
                  </Typography>
                </View>
                <View style={{ flex: 1 }}>
                  <Typography>{value.name}</Typography>
                  <Typography size="1" color={themeColor.gray[11]}>
                    {getFileSize(value.size)}
                  </Typography>
                </View>
                <FlexRow justifyContent="flex-end" style={{ alignSelf: "stretch" }}>
                  <Button
                    variant="ghost"
                    color="neutral"
                    onPress={() => onChange(null)}
                    style={{ paddingVertical: 0, paddingHorizontal: 0 }}
                    icon={<AntDesign name="close" size={16} color={themeColor.gray[11]} />}
                  />
                </FlexRow>
              </FlexRow>
              <Padding height={8} />
            </>
          )}
          <Button
            variant="soft"
            title={title}
            disabled={props.disabled}
            onPress={() => {
              handleFileChage(onChange);
            }}
            {...btnProps}
          />
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

const styles = StyleSheet.create({
  extension: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(DocumentPicker);
