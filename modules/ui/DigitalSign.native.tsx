import React, { useCallback, useContext, useState } from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import Signature from "react-native-signature-canvas";

import { ThemeContext } from "@niveshstar/context";

import { ButtonPropsType } from "./Button";
import Typography from "./Typography";

interface PropsType {
  onSubmit: (sign: string) => void;
  primaryBtnProps?: Omit<ButtonPropsType, "title" | "onPress">;
  secondaryBtnProps?: Omit<ButtonPropsType, "title" | "onPress">;
}
export default function DigitalSign(props: PropsType) {
  const { onSubmit } = props;

  const { themeColor } = useContext(ThemeContext);
  const [showError, setShowError] = useState(false);

  const handleEmpty = useCallback(() => {
    setShowError(true);
  }, []);

  const handleSubmit = useCallback(
    (sign: string) => {
      setShowError(false);
      onSubmit(sign);
    },
    [onSubmit]
  );

  return (
    <>
      <Signature onOK={handleSubmit} onEmpty={handleEmpty} />
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
    </>
  );
}
