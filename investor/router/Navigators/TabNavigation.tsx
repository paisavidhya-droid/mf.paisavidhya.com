import React, { useContext } from "react";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ThemeContext } from "@niveshstar/context";

import HomeTab from "../TabScreen/HomeTab";
import PlansTab from "../TabScreen/PlansTab";
import ProfileTab from "../TabScreen/ProfileTab";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  const { themeColor } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      id={undefined}
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: {
          height: 70,
          marginBottom: -15,
          borderTopWidth: 1,
          borderColor: themeColor.gray[6],
          backgroundColor: themeColor.gray[1],
        },
        sceneStyle: {
          backgroundColor: themeColor.accent[9],
        },
        tabBarInactiveTintColor: themeColor.gray[12],
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeTab}
        options={{
          title: "Home",
          headerShown: false,
          tabBarActiveTintColor: themeColor.accent[9],
          tabBarIcon: ({ color }) => <AntDesign name="home" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="plans"
        component={PlansTab}
        options={{
          title: "Plans",
          headerShown: false,
          tabBarActiveTintColor: themeColor.accent[9],
          tabBarIcon: ({ color }) => <MaterialIcons name="event-note" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileTab}
        options={{
          title: "Profile",
          headerShown: false,
          tabBarActiveTintColor: themeColor.accent[9],
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={18} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
