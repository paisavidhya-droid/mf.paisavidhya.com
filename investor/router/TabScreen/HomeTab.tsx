import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ThemeContext } from "@niveshstar/context";

import { Navbar } from "../../components/common";
import Analytics from "../../container/Analytics/Analytics";
import Holdings from "../../container/Home/Holdings";
import Home from "../../container/Home/Home";
import Import from "../../container/Home/Import";
import MorePage from "../../container/Home/MorePage";
import MutualFunds from "../../container/Home/MutualFunds";
import Order from "../../container/Home/OrderList";
import Scheme from "../../container/Home/Scheme";
import SIP from "../../container/Home/SIP";
import UserCart from "../../container/Home/UserCart";
import UserMandate from "../../container/Home/UserMandate";
import PaymentSuccess from "../../container/Payment/PaymentSuccess";

const Stack = createNativeStackNavigator();

export default function HomeTab() {
  const { themeColor } = useContext(ThemeContext);

  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="main"
      screenOptions={{
        contentStyle: {
          backgroundColor: themeColor.accent[9],
        },
      }}
    >
      <Stack.Screen
        name="main"
        component={Home}
        options={{
          title: "Home",
          header: () => <Navbar title="Home" />,
        }}
      />

      <Stack.Screen
        name="import"
        component={Import}
        options={{
          title: "Import",
          header: () => <Navbar title="Manual import" />,
        }}
      />

      <Stack.Screen
        name="mutual-funds"
        component={MutualFunds}
        options={{
          title: "Mutual Funds",
          header: () => <Navbar title="Mutual Funds" />,
        }}
      />

      <Stack.Screen
        name="mutual-funds/scheme"
        component={Scheme}
        options={{
          title: "Scheme Info",
          header: () => <Navbar title="Scheme Info" />,
        }}
      />

      <Stack.Screen
        name="cart"
        component={UserCart}
        options={{
          title: "Cart",
          header: () => <Navbar title="Cart" />,
        }}
      />

      <Stack.Screen
        name="payment-success"
        component={PaymentSuccess}
        options={{
          title: "Payment",
          header: () => <Navbar title="Payment Success" />,
        }}
      />

      <Stack.Screen
        name="sip"
        component={SIP}
        options={{
          title: "SIP",
          header: () => <Navbar title="SIP" />,
        }}
      />

      <Stack.Screen
        name="more"
        component={MorePage}
        options={{
          title: "More",
          header: () => <Navbar title="More" />,
        }}
      />

      <Stack.Screen
        name="mandate"
        component={UserMandate}
        options={{
          title: "Mandate",
          header: () => <Navbar title="Mnadate" />,
        }}
      />

      <Stack.Screen
        name="holdings"
        component={Holdings}
        options={{
          title: "Holdings",
          header: () => <Navbar title="Holdings" />,
        }}
      />

      <Stack.Screen
        name="order"
        component={Order}
        options={{
          title: "Orders",
          header: () => <Navbar title="Orders" />,
        }}
      />

      <Stack.Screen
        name="analytics"
        component={Analytics}
        options={{
          title: "Analytics",
          header: () => <Navbar title="Analytics" />,
        }}
      />
    </Stack.Navigator>
  );
}
