import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import { RootStateType } from "@niveshstar/context";

import Login from "../../container/Auth/Login";
import Register from "../../container/Auth/Regsiter";
import ResetPassword from "../../container/Auth/ResetPassword";
import SignUp from "../../container/Auth/SignUp";

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
  const authDetail = useSelector((state: RootStateType) => state.auth);

  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName={authDetail.id && !authDetail.firstName ? "register" : "login"}
      screenOptions={{
        headerShown: false,
        animation: "none",
        animationDuration: 0,
      }}
    >
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="signup" component={SignUp} />
      <Stack.Screen name="reset-password" component={ResetPassword} />
      {authDetail.id ? <Stack.Screen name="register" component={Register} /> : null}
    </Stack.Navigator>
  );
}
