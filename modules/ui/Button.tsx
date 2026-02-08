import React, { useContext, useMemo } from "react";
import { ActivityIndicator, Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";

import { colors } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";

import FlexRow, { FlexRowPropsType } from "./FlexRow";
import Typography, { TypographyPropsType } from "./Typography";

export type ButtonColor = "default" | "success" | "danger" | "neutral";
export type ButtonVariant = "default" | "soft" | "outline" | "ghost" | "link";

export interface ButtonPropsType extends PressableProps {
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  color?: ButtonColor;
  style?: StyleProp<any>;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  typographyProps?: Omit<TypographyPropsType, "children">;
  flexRowProps?: Omit<FlexRowPropsType, "children">;
}

function Button(props: ButtonPropsType) {
  const {
    variant = "default",
    color = "default",
    title,
    disabled = false,
    loading = false,
    icon,
    style = {},
    ...rest
  } = props;

  const { themeColor } = useContext(ThemeContext);

  const colorMap = useMemo(
    () => ({
      default: themeColor.accent,
      success: themeColor.green,
      danger: themeColor.red,
      neutral: themeColor.gray,
    }),
    [themeColor]
  );

  const selectedColor = colorMap[color];

  const variantStyles = useMemo(() => {
    const base: ViewStyle = {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    };

    switch (variant) {
      case "default":
        return {
          ...base,
          backgroundColor: selectedColor[9],
          borderWidth: 1,
          borderColor: selectedColor[9],
        };
      case "soft":
        return {
          ...base,
          backgroundColor: selectedColor[3],
          borderWidth: 1,
          borderColor: selectedColor[4],
        };
      case "outline":
        return {
          ...base,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: selectedColor[7],
        };
      case "ghost":
        return {
          ...base,
          backgroundColor: "transparent",
          borderWidth: 0,
        };
      case "link":
        return {
          ...base,
          backgroundColor: "transparent",
          borderWidth: 0,
        };
      default:
        return base;
    }
  }, [variant, selectedColor]);

  const textColor = useMemo(() => {
    switch (variant) {
      case "default":
        return colors.white;
      case "soft":
        return selectedColor[11];
      case "outline":
        return selectedColor[11];
      case "ghost":
        return selectedColor[11];
      case "link":
        return selectedColor[11];
      default:
        return themeColor.gray[11];
    }
  }, [variant, selectedColor, themeColor]);

  const pressEffect = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }): ViewStyle => {
        if (disabled) return { opacity: 0.5 };
        if (!pressed) return {};

        switch (variant) {
          case "default":
            return { backgroundColor: selectedColor[10] };
          case "soft":
            return { backgroundColor: selectedColor[4] };
          case "outline":
            return { backgroundColor: selectedColor[2] };
          case "ghost":
            return { backgroundColor: selectedColor[3] };
          default:
            return {};
        }
      },
    [variant, selectedColor, disabled]
  );

  return (
    <Pressable disabled={disabled} style={(state) => [variantStyles, pressEffect(state), style]} {...rest}>
      <FlexRow alignItems="center" {...rest.flexRowProps}>
        {loading ? <ActivityIndicator color={textColor} size={16} style={{ marginRight: 8 }} /> : null}
        {icon ? icon : null}
        {title ? (
          <Typography align="center" color={textColor} weight="medium" {...rest.typographyProps}>
            {title}
          </Typography>
        ) : null}
      </FlexRow>
    </Pressable>
  );
}

export default React.memo(Button);
