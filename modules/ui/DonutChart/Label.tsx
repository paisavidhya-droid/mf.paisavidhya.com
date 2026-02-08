import React from "react";
import { StyleSheet, View } from "react-native";

import FlexRow from "../FlexRow";
import Padding from "../Padding";
import Typography from "../Typography";

interface DataType {
  value: number;
  color: string;
  label: string;
  percentage: number;
}

interface PropsType {
  item: DataType;
  index: number;
  lastItem: boolean;
}

export default function Label(props: PropsType) {
  const { item, index, lastItem } = props;

  return (
    <View style={{ paddingRight: lastItem ? 0 : 20 }}>
      <FlexRow vCenter noWrap>
        <View style={{ paddingBottom: 2 }}>
          <View style={[styles.color, { backgroundColor: item.color }]} />
        </View>
        <Padding width={5} />
        <Typography weight="500">{item.label}</Typography>
      </FlexRow>
    </View>
  );
}

const styles = StyleSheet.create({
  color: {
    width: 15,
    height: 15,
    borderRadius: 15,
  },
});
