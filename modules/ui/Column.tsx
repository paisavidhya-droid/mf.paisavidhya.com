import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface PropsType {
  col: number;
  offset?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function Column(props: PropsType) {
  const { col, offset = 0, style = {} } = props;

  return (
    <View
      style={[
        {
          width: `${(col * 100) / 24}%`,
          paddingHorizontal: offset,
          display: col === 0 ? "none" : "flex",
        },
        style,
      ]}
    >
      {props.children}
    </View>
  );
}

export default React.memo(Column);
