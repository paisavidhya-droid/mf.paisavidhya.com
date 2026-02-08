import React, { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { ThemeContext } from "@niveshstar/context";
import { SchemeSingle } from "@niveshstar/ui";

function Scheme() {
  const { themeColor } = useContext(ThemeContext);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <SchemeSingle />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
});

export default React.memo(Scheme);
