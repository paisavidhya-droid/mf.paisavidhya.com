import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Calculator } from "@niveshstar/ui";

import { Navbar } from "../../components/common";
import Plans from "../../container/Plans/Plans";

const Stack = createNativeStackNavigator();

export default function PlansTab() {
  return (
    <Stack.Navigator id={undefined} initialRouteName="main">
      <Stack.Screen
        name="main"
        component={Plans}
        options={{
          title: "Plans",
          header: () => <Navbar title="Plans" />,
        }}
      />

      <Stack.Screen
        name="calculator"
        component={Calculator}
        options={{
          title: "Children's Education",
          header: () => <Navbar title="Calculator" />,
        }}
      />
    </Stack.Navigator>
  );
}
