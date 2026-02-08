import React, { useCallback, useContext } from "react";
import { Image, ImageProps, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePickerExpo from "expo-image-picker";
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
  disabled?: boolean;
  control: Control<any>;
  imageProps?: ImageProps;
  labelExtraContent?: React.ReactNode;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
  btnProps?: Omit<ButtonPropsType, "title">;
}

export type ImagePickerResult = ImagePickerExpo.ImagePickerAsset;

function ImagePicker(props: PropsType) {
  const { name, label, title, control, rules = {}, labelExtraContent, imageProps = {}, btnProps = {} } = props;

  const { themeColor } = useContext(ThemeContext);

  const handleImageChage = useCallback(async (onChange: (e: any) => void) => {
    try {
      const { status } = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (result.canceled) return;
      onChange(result.assets[0]);
    } catch {
      //show permission errr
    }
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <FlexRow justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
            <FlexRow alignItems="center" style={{ flexGrow: 1 }}>
              {label ? (
                <Typography>
                  {label}
                  {typeof rules.required === "object" && rules.required.value ? (
                    <Typography color={themeColor.red[11]}> *</Typography>
                  ) : null}
                </Typography>
              ) : null}
              {labelExtraContent ? labelExtraContent : null}
            </FlexRow>
            {value ? (
              <Button
                onPress={() => onChange("")}
                variant="ghost"
                color="neutral"
                style={{ paddingVertical: 0, paddingHorizontal: 0 }}
                icon={<AntDesign name="close" size={18} color={themeColor.gray[11]} />}
              />
            ) : null}
          </FlexRow>
          {!value ? null : (
            <>
              <Image resizeMode="stretch" resizeMethod="scale" source={{ uri: value.uri ?? value }} {...imageProps} />
              <Padding height={8} />
            </>
          )}
          <Button
            variant="soft"
            title={title}
            disabled={props.disabled}
            onPress={() => {
              handleImageChage(onChange);
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

export default React.memo(ImagePicker);
