import React, { useContext } from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";

import { ThemeContext } from "@niveshstar/context";

interface PropsType extends ViewProps {
  height?: number;
  style?: StyleProp<ViewStyle>;
}

function Divider(props: PropsType) {
  const { height = 1, style, ...rest } = props;
  const { themeColor } = useContext(ThemeContext);
  return (
    <View
      style={[
        {
          height: height,
          width: "100%",
          backgroundColor: themeColor.gray[6],
        },
        style,
      ]}
      {...rest}
    />
  );
}

export default React.memo(Divider);
