import React, { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { ThemeContext } from "@niveshstar/context";
import { InvestorPortfolio } from "@niveshstar/ui";

function Home() {
  const { themeColor } = useContext(ThemeContext);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <InvestorPortfolio />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
});

export default React.memo(Home);
