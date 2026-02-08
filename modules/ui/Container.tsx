import React, { useContext } from "react";
import { DimensionValue, StyleSheet, View } from "react-native";

import { paddingVertical, themeColor } from "@niveshstar/constant";
import { ScreenContext, ThemeContext } from "@niveshstar/context";

import Column from "./Column";
import FlexRow from "./FlexRow";
import Padding from "./Padding";

interface PropsType {
  children: React.ReactNode;
  webWidth?: DimensionValue;
  mobileWidth?: DimensionValue;
  backgroundColor?: string;
  paddingMobile?: number;
  LeftBarComponent?: React.JSX.Element;
  leftBarNegetiveHeight?: number;
}

export default function Container(props: PropsType) {
  const screenSize = useContext(ScreenContext).screenType;
  const { isLight } = useContext(ThemeContext);

  const {
    children,
    webWidth = "98%",
    mobileWidth = "100%",
    backgroundColor = themeColor[isLight].background,
    paddingMobile = 10,
    LeftBarComponent,
    leftBarNegetiveHeight = 0,
  } = props;

  const showLeftBar = LeftBarComponent != null;

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        ...styles.flex,
      }}
    >
      <div
        style={{
          width: screenSize === "sm" ? mobileWidth : (webWidth as any),
          paddingLeft: screenSize === "sm" ? paddingMobile : 0,
          paddingRight: screenSize === "sm" ? paddingMobile : 0,
          margin: "0 auto",
          position: "relative",
          boxSizing: "border-box",
          overflowX: "clip",
          ...styles.flex,
        }}
      >
        <FlexRow offset={10} responsive style={{ flex: 1 }}>
          {showLeftBar && screenSize !== "sm" ? (
            <Column
              col={3}
              offset={10}
              style={{
                position: "sticky",
                top: "0px",
              }}
            >
              <div
                style={{
                  height: `calc(100vh - ${leftBarNegetiveHeight}px)`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Padding height={paddingVertical} />
                {showLeftBar ? LeftBarComponent : null}
                <Padding height={paddingVertical} />
              </div>
            </Column>
          ) : null}
          <Column col={showLeftBar ? 9 : 12} offset={10} style={{ height: "100%" }}>
            <View style={{ flex: 1 }}>
              <>{children}</>
            </View>
          </Column>
        </FlexRow>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  flex: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
});
