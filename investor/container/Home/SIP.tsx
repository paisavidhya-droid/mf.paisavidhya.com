import React, { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { ThemeContext } from "@niveshstar/context";
import { CustomCard, SipList } from "@niveshstar/ui";

function SIP() {
  const { themeColor } = useContext(ThemeContext);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <CustomCard style={{ flexGrow: 1 }}>
        <SipList />
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

export default React.memo(SIP);
