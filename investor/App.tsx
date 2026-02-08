import React, { useCallback, useContext, useEffect, useState } from "react";
import { loadAsync } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";

import "react-native-gesture-handler";
import "react-native-reanimated";

import {
  AppDispatch,
  ScreenContextProvider,
  setAuthDetail,
  store,
  ThemeContext,
  ThemeContextProvider,
} from "@niveshstar/context";
import { delteItemInLocalStorage, getItemFromLocalStorage } from "@niveshstar/utils";

import Router from "./router/Router";

export default function App() {
  Animated.addWhitelistedNativeProps({ text: true });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenContextProvider>
        <ThemeContextProvider>
          <SafeAreaProvider>
            <Provider store={store}>
              <WithContext />
            </Provider>
          </SafeAreaProvider>
        </ThemeContextProvider>
      </ScreenContextProvider>
    </GestureHandlerRootView>
  );
}

const WithContext = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { themeColor, setTheme } = useContext(ThemeContext);
  const [isAppReady, setIsAppReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  useEffect(() => {
    const loadApp = async () => {
      try {
        await loadAsync({
          "Inter-Light": require("@niveshstar/assets/fonts/Inter-Light.otf"),
          "Inter-Regular": require("@niveshstar/assets/fonts/Inter-Regular.otf"),
          "Inter-Medium": require("@niveshstar/assets/fonts/Inter-Medium.otf"),
          "Inter-Bold": require("@niveshstar/assets/fonts/Inter-Bold.otf"),
        });

        const themeDetails = await getItemFromLocalStorage("themeDetail");
        const authDetail = await getItemFromLocalStorage("authDetail");

        if (authDetail) await dispatch(setAuthDetail(authDetail));
        if (themeDetails?.variant !== undefined && themeDetails?.mode !== undefined) {
          await setTheme(themeDetails.mode, themeDetails.variant);
        } else {
          await delteItemInLocalStorage("themeDetail");
        }
      } catch {
        // show error page
      } finally {
        setIsAppReady(true);
      }
    };

    loadApp();
  }, [dispatch, setTheme]);

  if (!isAppReady) {
    return null;
  }

  return (
    <SafeAreaView onLayout={onLayoutRootView} style={{ flex: 1, backgroundColor: themeColor.accent[9] }}>
      <Router />
    </SafeAreaView>
  );
};
