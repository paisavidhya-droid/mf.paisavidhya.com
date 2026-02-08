import React, { useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemeContext } from "@niveshstar/context";

import FlexRow from "./FlexRow";
import Padding from "./Padding";
import Typography from "./Typography";

interface PropsType {
  label: string | number;
  checked: boolean;
  onChange: (value: any) => void;
  disabled?: boolean;
}

function InputRadio(props: PropsType) {
  const { label, checked, onChange, disabled = false } = props;
  const { themeColor } = useContext(ThemeContext);

  return (
    <Pressable style={styles.container} onPress={onChange} disabled={disabled}>
      <FlexRow justifyContent="center" alignItems="center">
        <View
          style={[
            styles.radio,
            {
              borderColor: disabled ? themeColor.gray[1] : themeColor.gray[6],
              backgroundColor: checked ? themeColor.accent[9] : disabled ? themeColor.gray[3] : themeColor.gray[1],
            },
          ]}
        >
          <Typography>&nbsp;</Typography>
        </View>
        <Padding width={10} />
        <Typography>{label}</Typography>
      </FlexRow>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginEnd: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 200,
    borderWidth: 2,
  },
});

export default React.memo(InputRadio);
