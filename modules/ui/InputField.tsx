import React, { useContext, useMemo, useState } from "react";
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import { MotiView } from "moti";

import { ThemeContext } from "@niveshstar/context";

import Typography from "./Typography";

interface PropsType extends TextInputProps {
  error?: any;
  fieldRef?: (ref: any) => void;
  extraContent?: React.ReactNode;
  subtitleContent?: React.ReactNode;
  disabled?: boolean;
}

function InputField(props: PropsType) {
  const { error, fieldRef, extraContent, style, disabled = false, subtitleContent = null, ...restProps } = props;

  const [isFocused, setIsFocused] = useState(false);
  const { themeColor } = useContext(ThemeContext);

  const variant = useMemo(() => (error ? "error" : "default"), [error]);

  const baseStyle: ViewStyle & TextStyle = useMemo(
    () => ({
      outlineStyle: "none",
      outlineWidth: 0,
      outlineColor: "transparent",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      fontSize: 14,
      lineHeight: 20,
      color: themeColor.gray[12],
      backgroundColor: themeColor.gray[1],
      borderColor: themeColor.gray[6],
    }),
    [themeColor]
  );

  const placeholderColors: StyleProp<any> = useMemo(
    () => ({
      default: themeColor.gray[9],
      error: themeColor.red[9],
    }),
    [themeColor]
  );

  const disabledStyle: StyleProp<any> = useMemo(
    () => ({
      borderColor: themeColor.gray[1],
      backgroundColor: themeColor.gray[3],
      color: themeColor.gray[8],
      cursor: "not-allowed",
    }),
    [themeColor]
  );

  const focusStyle: StyleProp<any> = useMemo(
    () => ({
      default: {
        borderColor: themeColor.blue["a7"],
      },
      error: {
        borderColor: themeColor.red["a7"],
      },
    }),
    [themeColor]
  );

  return (
    <View>
      <View style={[styles.container, isFocused ? focusStyle[variant] : {}]}>
        <TextInput
          ref={(ref) => {
            if (fieldRef) return fieldRef(ref);
            return null;
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            baseStyle,
            isFocused ? focusStyle[variant] : {},
            error ? { borderColor: themeColor.red[6] } : {},
            disabled ? disabledStyle : {},
            style,
          ]}
          placeholderTextColor={placeholderColors[variant]}
          editable={!disabled}
          {...restProps}
        />
      </View>
      {extraContent}
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
        ) : (
          subtitleContent
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    borderColor: "transparent",
    borderRadius: 9,
  },
});

export default React.memo(InputField);
