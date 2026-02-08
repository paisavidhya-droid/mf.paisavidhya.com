import React, { useCallback, useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import { colors } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";
import { toastHelper } from "@niveshstar/utils";

import FlexRow from "./FlexRow";
import Padding from "./Padding";
import Typography from "./Typography";

interface PropsType {
  title: string;
  value: string;
  label?: string;
}

function CopyToClipboard(props: PropsType) {
  const { title, value, label } = props;
  const { themeColor } = useContext(ThemeContext);

  const copyToClipboard = useCallback(async () => {
    const res = await Clipboard.setStringAsync(value);
    if (res) toastHelper("success", "Copied to clipboard");
    else toastHelper("error", "Something went wrong");
  }, [value]);

  return (
    <>
      {label ? (
        <>
          <Typography>{label}</Typography>
          <Padding height={8} />
        </>
      ) : null}
      <View style={[styles.container, { borderColor: themeColor.gray[6] }]}>
        <FlexRow justifyContent="space-between" alignItems="center">
          <Typography size="1" color={themeColor.accent[9]} style={{ flex: 1 }} numberOfLines={1}>
            {title}
          </Typography>
          <Pressable onPress={copyToClipboard} hitSlop={10}>
            <Feather name="copy" size={20} color={themeColor.gray[12]} />
          </Pressable>
        </FlexRow>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
  },
});

export default React.memo(CopyToClipboard);
