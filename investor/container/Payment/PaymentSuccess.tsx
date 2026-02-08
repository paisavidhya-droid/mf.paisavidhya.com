import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import { ThemeContext } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, FlexRow, Padding, Typography } from "@niveshstar/ui";

export default function PaymentSuccess() {
  const { navigator } = useNavigation();
  const { themeColor } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: themeColor.green[3] }]}>
      <FlexRow alignItems="center" justifyContent="center" style={{ flexGrow: 1, flexDirection: "column" }}>
        <AntDesign name="check-circle" size={100} color={themeColor.green[9]} />
        <Padding height={24} />
        <Typography size="5" weight="medium">
          Payment Successful
        </Typography>
        <Padding height={24} />
        <FlexRow>
          <Button title="Go Home" onPress={() => navigator.replace("home", "main")} />
        </FlexRow>
      </FlexRow>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
  },
});
