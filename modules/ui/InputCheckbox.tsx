import React, { useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { colors } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";

import FlexRow from "./FlexRow";
import Padding from "./Padding";
import Typography from "./Typography";

interface PropsType {
  label: string | number;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: any) => void;
}

export default function InputCheckbox(props: PropsType) {
  const { label, checked, disabled = false, onChange } = props;
  const { themeColor } = useContext(ThemeContext);

  return (
    <FlexRow>
      <Pressable onPress={onChange} disabled={disabled}>
        <FlexRow justifyContent="center" alignItems="center">
          {checked ? (
            <View
              style={[
                styles.radio,
                {
                  borderWidth: 0,
                  backgroundColor: themeColor.accent[9],
                },
              ]}
            >
              <AntDesign name="check" size={14} color={colors.white} />
            </View>
          ) : (
            <View
              style={[
                styles.radio,
                {
                  borderColor: disabled ? themeColor.gray[1] : themeColor.gray[6],
                  backgroundColor: disabled ? themeColor.gray[3] : themeColor.gray[2],
                },
              ]}
            >
              <Typography>&nbsp;</Typography>
            </View>
          )}
          <Padding width={8} />
          <Typography>{label}</Typography>
        </FlexRow>
      </Pressable>
    </FlexRow>
  );
}

const styles = StyleSheet.create({
  radio: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
