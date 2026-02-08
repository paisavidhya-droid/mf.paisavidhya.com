import React, { useContext } from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";

import { ThemeContext } from "@niveshstar/context";

interface PropsType extends ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function CustomCard(props: PropsType) {
  const { style, children, ...rest } = props;
  const { themeColor } = useContext(ThemeContext);

  return (
    <View
      style={[
        {
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: themeColor.gray[6],
          shadowColor: themeColor.gray["a5"],
          backgroundColor: themeColor.gray[2],
          shadowOpacity: 0.25,
          shadowOffset: {
            width: 2,
            height: 4,
          },
          elevation: 6,
          shadowRadius: 6,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
