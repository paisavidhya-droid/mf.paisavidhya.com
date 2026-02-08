import React from "react";
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";

import Typography from "./Typography";

interface PropsType extends ViewProps {
  style?: StyleProp<ViewStyle>;
  message?: string;
}

function EmptyResult(props: PropsType) {
  const { message = "Nothing to show!!", style } = props;

  return (
    <View style={[styles.container, style]}>
      <Typography size="3" weight="medium" align="center">
        {message}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(EmptyResult);
