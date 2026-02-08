import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export interface FlexRowPropsType {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  offset?: number;
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  rowGap?: number;
  colGap?: number;
  wrap?: boolean;
}

function FlexRow(props: FlexRowPropsType) {
  const {
    children,
    style = {},
    offset = 0,
    justifyContent = "flex-start",
    alignItems = "flex-start",
    rowGap = 0,
    colGap = 0,
    wrap = false,
  } = props;

  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
          justifyContent: justifyContent,
          alignItems: alignItems,
          rowGap: rowGap,
          columnGap: colGap,
          marginHorizontal: -offset,
          flexWrap: wrap ? "wrap" : "nowrap",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default React.memo(FlexRow);
