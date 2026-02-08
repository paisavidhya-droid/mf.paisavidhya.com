import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext } from "@niveshstar/context";

import AuthNavigation from "./AuthNavigation";
import TabNavigation from "./TabNavigation";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName={authDetail.id && authDetail.firstName ? "tab" : "auth"}
      screenOptions={{
        headerShown: false,
        animation: "none",
        animationDuration: 0,
        contentStyle: {
          backgroundColor: themeColor.accent[9],
        },
      }}
    >
      <Stack.Screen name="auth" component={AuthNavigation} />
      {authDetail.id && authDetail.firstName ? <Stack.Screen name="tab" component={TabNavigation} /> : null}
    </Stack.Navigator>
  );
}
