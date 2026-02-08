import React, { useContext, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { calculatorUrl } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import CustomCard from "./CustomCard";
import Embeddings from "./Embeddings";

function Calculator() {
  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);

  const url = useMemo(() => {
    const index = parseInt(params?.index || "0");
    return calculatorUrl[index];
  }, [params]);

  return (
    <View style={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <CustomCard style={{ flexGrow: 1 }}>
        <Embeddings url={url} style={{ maxWidth: 600 }} />
      </CustomCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
});

export default React.memo(Calculator);
