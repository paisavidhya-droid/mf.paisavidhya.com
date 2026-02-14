import React, { createContext, useCallback, useState } from "react";

import { ColorsType, lightColors, themeMap, ThemeVariantType } from "@niveshstar/constant";
import { setItemInLocalStorage } from "@niveshstar/utils";

interface ThemeContextType {
  isLight: boolean;
  toggleTheme: () => Promise<void>;
  themeVariant: ThemeVariantType;
  setTheme: (newMode: boolean, themeType: ThemeVariantType) => Promise<void>;
  themeColor: ColorsType;
}

const ThemeContext = createContext<ThemeContextType>({
  isLight: true,
  toggleTheme: undefined,
  setTheme: undefined,
  themeVariant: "DEFAULT",
  themeColor: lightColors,
});

const ThemeContextProvider = (props: { children: React.ReactNode }) => {
  const [isLight, setIsLight] = useState(true);
  const [themeVariant, setThemeVariant] = useState<ThemeVariantType>("DEFAULT");

  const handleToggleTheme = useCallback(async () => {
    const newMode = !isLight;
    setIsLight(newMode);
    await setItemInLocalStorage("themeDetail", { mode: newMode, variant: themeVariant });
  }, [isLight, themeVariant]);

  const handleSetTheme = useCallback(async (newMode: boolean, newThemeType: ThemeVariantType) => {
    setIsLight(newMode);
    setThemeVariant(newThemeType);
    await setItemInLocalStorage("themeDetail", { mode: newMode, variant: newThemeType });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        isLight: isLight,
        themeVariant: themeVariant,
        toggleTheme: handleToggleTheme,
        setTheme: handleSetTheme,
        themeColor: themeMap[themeVariant][isLight ? 0 : 1],
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export { ThemeContextProvider, ThemeContext };
