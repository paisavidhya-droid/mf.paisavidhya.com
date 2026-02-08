import React, { useContext, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

import { ThemeContext } from "@niveshstar/context";
import { toastConfig } from "@niveshstar/utils";

import RootNavigation from "./Navigators/RootNavigation";

const Router = () => {
  const navigationRef = useRef(null);
  const { themeColor, isLight } = useContext(ThemeContext);

  return (
    <>
      <StatusBar backgroundColor={themeColor.accent[9]} style={isLight ? "light" : "dark"} />
      <NavigationContainer ref={navigationRef}>
        <RootNavigation />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

export default Router;
