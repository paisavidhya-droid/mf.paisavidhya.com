import React from "react";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

import { colors, lightColors } from "@niveshstar/constant";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: lightColors.green[9],
        alignSelf: "flex-end",
        borderLeftWidth: 0,
        borderRadius: 6,
        marginRight: 16,
        height: "auto",
        paddingRight: 15,
      }}
      text1Style={{ color: colors.white, fontSize: 12, lineHeight: 16 }}
      text2Style={{ color: colors.white, fontSize: 12, lineHeight: 16 }}
      contentContainerStyle={{ padding: 15 }}
      text1NumberOfLines={200}
      renderTrailingIcon={() => (
        <Pressable onPress={() => Toast.hide()} style={{ justifyContent: "center" }}>
          <AntDesign name="close-circle" size={16} color={colors.white} />
        </Pressable>
      )}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: lightColors.red[9],
        alignSelf: "flex-end",
        borderLeftWidth: 0,
        borderRadius: 6,
        marginRight: 16,
        height: "auto",
        paddingRight: 15,
      }}
      text1Style={{ color: colors.white, fontSize: 12, lineHeight: 16 }}
      text2Style={{ color: colors.white, fontSize: 12, lineHeight: 16 }}
      contentContainerStyle={{ padding: 15 }}
      text1NumberOfLines={200}
      renderTrailingIcon={() => (
        <Pressable onPress={() => Toast.hide()} style={{ justifyContent: "center" }}>
          <AntDesign name="close-circle" size={16} color={colors.white} />
        </Pressable>
      )}
    />
  ),
};

export const toastHelper = (type: "success" | "error", message: string, duration?: number) => {
  Toast.show({
    type,
    text1: message,
    position: "top",
    topOffset: 16,
    visibilityTime: duration || 3000,
  });
};
