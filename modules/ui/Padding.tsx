import React from "react";
import { View } from "react-native";

function Padding({ width = 8, height = 8 }) {
  return <View style={{ width: width, height: height }}></View>;
}

export default React.memo(Padding);
