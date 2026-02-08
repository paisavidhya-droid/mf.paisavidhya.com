import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

import { graphColors } from "@niveshstar/constant";

import FlexRow from "../FlexRow";
import Padding from "../Padding";
import DonutChart from "./DonutChart";
import Label from "./Label";

interface ChartDataType {
  value: number;
  color: string;
  label: string;
  percentage: number;
}

const RADIUS = 160;
const STROKE_WIDTH = 30;
const OUTER_STROKE_WIDTH = 46;
const GAP = 0.04;

type DataType = {
  label: string;
  value: number;
  color?: string;
};

interface PropsType {
  radius?: number;
  strokeWidth?: number;
  outerStrokeWidth?: number;
  gap?: number;
  data?: DataType[];
  valueLabel?: string;
}

export default function DonutChartContainer(props: PropsType) {
  const {
    radius = RADIUS,
    strokeWidth = STROKE_WIDTH,
    outerStrokeWidth = OUTER_STROKE_WIDTH,
    gap = GAP,
    data = [],
    valueLabel = "Value",
  } = props;

  const totalValue = useSharedValue(0);
  const decimals = useSharedValue<number[]>([]);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);

  useEffect(() => {
    const total = data.reduce((acc, currentValue) => acc + currentValue.value, 0);
    const decimalArr = data.map((val, _) => Math.round((val.value / total) * 100) / 100);

    totalValue.value = withTiming(total, { duration: 1000 });
    decimals.value = [...decimalArr];

    const tempChartData = data.map((value, index) => ({
      label: value.label,
      value: value.value,
      percentage: decimalArr[index] * 100,
      color: graphColors[index % graphColors.length],
    }));

    setChartData(tempChartData);
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={[styles.wrapper, { height: radius * 2 }]}>
        <DonutChart
          gap={gap}
          n={data.length}
          radius={radius}
          decimals={decimals}
          chartData={chartData}
          valueLabel={valueLabel}
          strokeWidth={strokeWidth}
          outerStrokeWidth={outerStrokeWidth}
        />
      </View>
      <Padding height={20} />
      <View style={{ maxWidth: radius * 2 }}>
        <FlexRow vCenter hCenter>
          {chartData.map((item, index) => (
            <Label item={item} key={index} index={index} lastItem={index === chartData.length - 1} />
          ))}
        </FlexRow>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  wrapper: {
    width: "100%",
  },
  chartContainer: {
    marginTop: 10,
  },
});
