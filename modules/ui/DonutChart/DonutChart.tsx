import React, { useCallback, useContext, useMemo } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Canvas, Circle, Group, Path, RoundedRect, Shadow, Skia, Text, useFont } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

import { graphColors } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";

import DonutPath from "./DonutPath";

interface ChartDataType {
  value: number;
  color: string;
  label: string;
  percentage: number;
}

interface PropsType {
  n: number;
  gap: number;
  radius: number;
  valueLabel: string;
  strokeWidth: number;
  outerStrokeWidth: number;
  chartData: ChartDataType[];
  decimals: SharedValue<number[]>;
}

const LABEL_BOX_WIDTH = 110;
const LABEL_BOX_HEIGHT = 30;
const LEGEND_CIRCLE_RADIUS = 5;

export default function DonutChart(props: PropsType) {
  const { n, gap, decimals, strokeWidth, outerStrokeWidth, radius, chartData, valueLabel } = props;

  const { themeColor } = useContext(ThemeContext);
  const font = useFont(require("@niveshstar/assets/fonts/Inter-Medium.otf"));

  const array = useMemo(() => {
    return Array.from({ length: n });
  }, [n]);

  const path = useMemo(() => {
    const skiaPath = Skia.Path.Make();
    const innerRadius = radius - outerStrokeWidth / 2;
    skiaPath.addCircle(radius, radius, innerRadius);
    return skiaPath;
  }, [radius]);

  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const selectedIndex = useSharedValue<number | null>(null);

  const canvasDiameter = useMemo(() => radius * 2, [radius]);

  const labelBoxPositionX = useDerivedValue(() => {
    let x = touchX.value - 40;
    if (x + LABEL_BOX_WIDTH > canvasDiameter) x = canvasDiameter - LABEL_BOX_WIDTH - 10;
    if (x < 10) x = 10;
    return x;
  });

  const labelBoxPositionY = useDerivedValue(() => {
    let y = touchY.value - 90;
    if (y < 10) y = 10;
    if (y + LABEL_BOX_HEIGHT > canvasDiameter) y = canvasDiameter - LABEL_BOX_HEIGHT - 10;
    return y;
  });

  const legendCirclePositionX = useDerivedValue(() => {
    return labelBoxPositionX.value + 15;
  });

  const legendCirclePositionY = useDerivedValue(() => {
    return labelBoxPositionY.value + 15;
  });

  const labelTextPositionX = useDerivedValue(() => {
    return labelBoxPositionX.value + 25;
  });

  const labelTextPositionY = useDerivedValue(() => {
    return labelBoxPositionY.value + 20;
  });

  const labelOpacity = useDerivedValue(() => {
    return withTiming(selectedIndex.value !== null ? 1 : 0, { duration: 200 });
  });

  const textColor = useDerivedValue(() => {
    if (selectedIndex.value === null || selectedIndex.value > chartData.length) return "transparent";
    return chartData[selectedIndex.value].color;
  }, [chartData]);

  const textContent = useDerivedValue(() => {
    if (selectedIndex.value === null || selectedIndex.value > chartData.length) return "";
    return `${valueLabel} ${chartData[selectedIndex.value].value}`;
  }, [chartData]);

  // const textLength = useDerivedValue(() => {
  //     if (!font) return LABEL_BOX_WIDTH;
  //     const width = font.getTextWidth(textContent.value);
  //     return width + 40;
  // }, [chartData]);

  const handleMoveEvent = useCallback((e: GestureResponderEvent) => {
    "worklet";
    const { locationX, locationY } = e.nativeEvent;

    // Update touch position
    touchX.value = locationX;
    touchY.value = locationY;

    // Calculate distance from the center
    const dx = locationX - radius;
    const dy = locationY - radius;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if inside the donut ring
    const touchPadding = 20; // Allows slight inaccuracy in touch

    const innerLimit = radius - strokeWidth - touchPadding;
    const outerLimit = radius + outerStrokeWidth + touchPadding;

    // Check if inside the expanded donut ring
    if (distance < innerLimit || distance > outerLimit) {
      selectedIndex.value = null;
      return;
    }
    // Convert to angle in radians
    let angle = Math.atan2(dy, dx);
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    // Convert radians to percentage
    const touchPercentage = angle / (2 * Math.PI);

    // Find which segment is being touched
    let accumulated = 0;
    let touchedIndex = -1;
    decimals.value.forEach((value, index) => {
      if (touchPercentage >= accumulated && touchPercentage < accumulated + value) {
        touchedIndex = index;
      }
      accumulated += value;
    });

    selectedIndex.value = touchedIndex;
  }, []);

  const onTouchMove = useCallback((e: GestureResponderEvent) => handleMoveEvent(e), []);
  const onTouchStart = useCallback((e: GestureResponderEvent) => handleMoveEvent(e), []);
  const onTouchEnd = useCallback((_: GestureResponderEvent) => {
    selectedIndex.value = null;
  }, []);

  if (!font) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <Canvas
        style={{
          width: canvasDiameter,
          height: canvasDiameter,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Path
          color={themeColor.background}
          strokeWidth={outerStrokeWidth}
          strokeJoin="round"
          strokeCap="round"
          style="stroke"
          path={path}
          start={0}
          end={1}
        />

        {array.map((_, index) => (
          <DonutPath
            outerStrokeWidth={outerStrokeWidth}
            color={graphColors[index]}
            strokeWidth={strokeWidth}
            decimals={decimals}
            radius={radius}
            index={index}
            font={font}
            key={index}
            gap={gap}
          />
        ))}

        <Group opacity={labelOpacity}>
          <RoundedRect
            color={themeColor.foreground}
            height={LABEL_BOX_HEIGHT}
            width={LABEL_BOX_WIDTH}
            x={labelBoxPositionX}
            y={labelBoxPositionY}
            r={12}
          >
            <Shadow color={themeColor.shadow} blur={3} dx={0} dy={0} />
          </RoundedRect>
          <Circle cx={legendCirclePositionX} cy={legendCirclePositionY} r={LEGEND_CIRCLE_RADIUS} color={textColor} />
          <Text color={themeColor.text} x={labelTextPositionX} y={labelTextPositionY} text={textContent} font={font} />
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
  },
});
