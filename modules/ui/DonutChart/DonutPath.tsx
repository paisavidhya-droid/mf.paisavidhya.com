import React, { useMemo } from "react";
import { Path, SkFont, Skia } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

interface PropsType {
  gap: number;
  font: SkFont;
  color: string;
  index: number;
  radius: number;
  strokeWidth: number;
  outerStrokeWidth: number;
  decimals: SharedValue<number[]>;
}

const DonutPath = (props: PropsType) => {
  const { radius, gap, strokeWidth, outerStrokeWidth, color, decimals, index, font } = props;

  const path = useMemo(() => {
    const skiaPath = Skia.Path.Make();
    const innerRadius = radius - outerStrokeWidth / 2;
    skiaPath.addCircle(radius, radius, innerRadius);
    return skiaPath;
  }, [radius]);

  const start = useDerivedValue(() => {
    if (index === 0) return gap;
    const decimal = decimals.value.slice(0, index);
    const sum = decimal.reduce((acc, val) => acc + val, 0);
    return sum + gap;
  }, []);

  const end = useDerivedValue(() => {
    if (index === decimals.value.length - 1) return 1;

    const decimal = decimals.value.slice(0, index + 1);
    const sum = decimal.reduce((acc, val) => acc + val, 0);
    return sum;
  }, []);

  return (
    <Path
      path={path}
      color={color}
      style="stroke"
      strokeJoin="round"
      strokeWidth={strokeWidth}
      strokeCap="round"
      start={start}
      end={end}
    />
  );
};

export default DonutPath;
