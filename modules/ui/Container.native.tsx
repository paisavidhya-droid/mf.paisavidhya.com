import React, { useContext } from "react";
import { DimensionValue, ScrollView, StyleSheet, View } from "react-native";

import { themeColor } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";

interface PropsType {
  children: React.ReactNode;
  webWidth?: DimensionValue;
  mobileWidth?: DimensionValue;
  backgroundColor?: string;
  paddingMobile?: number;
  LeftBarComponent?: React.JSX.Element;
  leftBarNegetiveHeight?: number;
}

export default function Container(props: PropsType) {
  const { isLight } = useContext(ThemeContext);
  const {
    children,
    webWidth = "98%",
    mobileWidth = "100%",
    backgroundColor = themeColor[isLight].background,
    paddingMobile = 10,
    LeftBarComponent,
  } = props;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: backgroundColor }]}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          width: mobileWidth,
          paddingHorizontal: paddingMobile,
          flex: 1,
        }}
      >
        <>{children}</>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
  },
});
