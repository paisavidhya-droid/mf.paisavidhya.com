import React, { useCallback, useContext, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { MotiView } from "moti";
import SignaturePad from "react-signature-pad-wrapper";

import { colors } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";

import Button, { ButtonPropsType } from "./Button";
import FlexRow from "./FlexRow";
import Padding from "./Padding";
import Typography from "./Typography";

interface PropsType {
  onSubmit: (sign: string) => void;
  primaryBtnProps?: Omit<ButtonPropsType, "title" | "onPress">;
  secondaryBtnProps?: Omit<ButtonPropsType, "title" | "onPress">;
}

function DigitalSign(props: PropsType) {
  const { onSubmit } = props;

  const { themeColor } = useContext(ThemeContext);

  const padRef = useRef(null);
  const [showError, setShowError] = useState(false);

  const handleSubmit = useCallback(() => {
    const isEmpty = padRef.current.isEmpty();
    if (isEmpty) {
      setShowError(true);
      return;
    }

    setShowError(false);

    const res = padRef.current.toDataURL("image/png");
    onSubmit(res);
  }, [onSubmit]);

  const handleClear = useCallback(() => {
    padRef.current.clear();
  }, []);

  return (
    <>
      <View style={[styles.container, { borderColor: themeColor.gray[6] }]}>
        <SignaturePad ref={padRef} />
      </View>
      <View style={{ height: 16 }}>
        {showError ? (
          <MotiView
            from={{ opacity: 0, translateY: -5 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 300 }}
          >
            <Typography size="1" color={themeColor.red[11]}>
              Please sign to proceed
            </Typography>
          </MotiView>
        ) : null}
      </View>
      <Padding height={8} />
      <FlexRow justifyContent="space-between" alignItems="center">
        <Button variant="soft" title="Clear" onPress={handleClear} {...props.secondaryBtnProps} />
        <Button title="Confirm" onPress={handleSubmit} {...props.primaryBtnProps} />
      </FlexRow>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 6,
  },
});

export default React.memo(DigitalSign);
