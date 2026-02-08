import React, { useContext } from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";

import { typographyConfig } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";
import { getFontFamily } from "@niveshstar/utils";

export type TypographyType = "text" | "heading";
export type RadixSize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type FontWeight = "light" | "regular" | "medium" | "bold";
export type TextAlignment = "left" | "center" | "right" | "justify";

export interface TypographyPropsType extends TextProps {
  children: React.ReactNode;
  type?: TypographyType;
  size?: RadixSize;
  weight?: FontWeight;
  color?: string;
  align?: TextAlignment;
  underlined?: boolean;
  style?: StyleProp<TextStyle>;
}

function Typography(props: TypographyPropsType) {
  const { themeColor } = useContext(ThemeContext);
  const {
    children,
    type = "text",
    size = "2",
    weight = typographyConfig.defaultWeight[type],
    color = themeColor.gray["12"],
    align = "left",
    underlined = false,
    style = {},
    ...restProps
  } = props;

  return (
    <Text
      style={[
        {
          fontFamily: getFontFamily(weight as FontWeight),
          fontSize: typographyConfig.fontSize[size],
          lineHeight: typographyConfig.lineHeight[type][size],
          letterSpacing: typographyConfig.letterSpacing[type][size],
          color: color,
          textAlign: align,
          textDecorationLine: underlined ? "underline" : "none",
        },
        style,
      ]}
      {...restProps}
    >
      {children}
    </Text>
  );
}

export default React.memo(Typography);
