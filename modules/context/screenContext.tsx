import React, { createContext, useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import { screenSizes } from "@niveshstar/constant";

const PLatformUtil = {
  isMobile: Platform.OS === "android" || Platform.OS === "ios",
  isWeb: Platform.OS === "web",
  Web: "Web",
  APP: "App",
};

type screenSizeType = "sm" | "md" | "lg" | "xl";

interface screenContextType {
  screenType: screenSizeType;
}

const ScreenContext = createContext<screenContextType>({
  screenType: "sm",
});

const ScreenContextProvider = (props: { children: React.ReactNode }) => {
  const getScreenType = useCallback(() => {
    if (PLatformUtil.isWeb) {
      const width = document.documentElement.clientWidth;
      let _screenType: screenSizeType = "sm";
      for (const [key, value] of Object.entries(screenSizes)) {
        //@ts-expect-error error
        if (width >= value) _screenType = key;
      }

      return _screenType;
    }
    return "sm";
  }, []);

  const [screenType, setScreenType] = useState<screenSizeType>(getScreenType());

  const updateScreenType = useCallback(() => {
    setScreenType(getScreenType());
  }, [getScreenType]);

  useEffect(() => {
    if (PLatformUtil.isWeb && window) window.addEventListener("resize", updateScreenType);

    return () => {
      if (PLatformUtil.isWeb && window) window.removeEventListener("resize", updateScreenType);
    };
  }, [updateScreenType]);

  return (
    <ScreenContext.Provider
      value={{
        screenType,
      }}
    >
      {props.children}
    </ScreenContext.Provider>
  );
};

export { ScreenContextProvider, ScreenContext, PLatformUtil };
