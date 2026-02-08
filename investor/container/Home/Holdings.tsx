import React, { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext } from "@niveshstar/context";
import { CustomCard, HoldingsTable } from "@niveshstar/ui";

function Holdings() {
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const computedPortfolio = null;
  const isLoading = false;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <CustomCard style={{ flexGrow: 1 }}>
        <HoldingsTable data={computedPortfolio} isLoading={isLoading} />
      </CustomCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
});

export default React.memo(Holdings);
