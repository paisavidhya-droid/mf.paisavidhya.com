import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Navbar } from "../../components/common";
import BankDetails from "../../container/Profile/OnBoarding/BankDetails";
import NomineeDetails from "../../container/Profile/OnBoarding/NomineeDetails";
import OnBoard from "../../container/Profile/OnBoarding/OnBoarding";
import PersonalDetails from "../../container/Profile/OnBoarding/PersonalDetails";
import SignDetails from "../../container/Profile/OnBoarding/SignDetails";
import Profile from "../../container/Profile/Profile";

const Stack = createNativeStackNavigator();

export default function ProfileTab() {
  return (
    <Stack.Navigator id={undefined} initialRouteName="main">
      <Stack.Screen
        name="main"
        component={Profile}
        options={{
          title: "Profile",
          header: () => <Navbar title="Profile" />,
        }}
      />

      <Stack.Screen
        name="onboarding"
        component={OnBoard}
        options={{
          title: "Onboarding",
          header: () => <Navbar title="Onboarding" />,
        }}
      />

      <Stack.Screen
        name="onboarding/personal-details"
        component={PersonalDetails}
        options={{
          title: "Personal Details",
          header: () => <Navbar title="Personal Details" />,
        }}
      />

      <Stack.Screen
        name="onboarding/nominee-details"
        component={NomineeDetails}
        options={{
          title: "Nominee Details",
          header: () => <Navbar title="Nominee Details" />,
        }}
      />

      <Stack.Screen
        name="onboarding/bank-details"
        component={BankDetails}
        options={{
          title: "Bank Details",
          header: () => <Navbar title="Bank Details" />,
        }}
      />

      <Stack.Screen
        name="onboarding/sign-details"
        component={SignDetails}
        options={{
          title: "Digital Sign",
          header: () => <Navbar title="Digital Sign" />,
        }}
      />
    </Stack.Navigator>
  );
}
