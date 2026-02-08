import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import { ThemeContext } from "@niveshstar/context";
import { Typography } from "@niveshstar/ui";

export default function ProgressBar({ percent }: { percent: number }) {
  const { themeColor } = useContext(ThemeContext);
  return (
    <View style={[styles.progressContainer, { borderBottomColor: themeColor.gray[6] }]}>
      <Typography weight="medium">
        {Math.round(percent)}%<Typography> completed</Typography>
      </Typography>
      <View style={[styles.progressWrapper, { backgroundColor: themeColor.gray[6] }]}>
        <View style={[styles.progress, { width: `${percent}%`, backgroundColor: themeColor.green[9] }]}>
          <Typography>&nbsp;</Typography>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    borderBottomWidth: 1,
    paddingBottom: 15,
    paddingTop: 10,
  },
  progressWrapper: {
    position: "relative",
    height: 20,
    borderRadius: 6,
  },
  progress: {
    position: "absolute",
    zIndex: 5,
    width: "43%",
    borderRadius: 6,
  },
});
