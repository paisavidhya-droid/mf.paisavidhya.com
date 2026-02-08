import React, { useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { colors } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";

// import { getTimeSinceLastSeen } from "@niveshstar/utils";

// import Column from "../Column";
// import FlexRow from "../FlexRow";
import Padding from "../Padding";
import Typography from "../Typography";

interface PropsType {
  data: any;
  isActive: boolean;
  handleUserClick: (data: any) => void;
}

function UserListRow(props: PropsType) {
  const { data, isActive, handleUserClick } = props;
  const { themeColor } = useContext(ThemeContext);

  const textColor = isActive ? colors.white : themeColor.gray[11];

  const fullName =
    (
      (data.first_name || "") +
      (data.middle_name ? " " + data.middle_name : "") +
      (data.last_name ? " " + data.last_name : "")
    ).trim() || "Unknown Name";

  return (
    <View style={[styles.container, { backgroundColor: isActive ? themeColor.accent[9] : themeColor.gray[2] }]}>
      <Pressable onPress={() => handleUserClick(data)}>
        <Typography weight="medium" color={isActive ? colors.white : themeColor.gray[12]}>
          {fullName}
        </Typography>
        <Padding height={8} />

        <Typography size="1" color={textColor}>
          {data.pan || "XXXXXXXXXX"} | {data.phone_number?.number || "XXXXXXXXXX"}
        </Typography>

        {/* <Padding height={4} />

        <FlexRow>
          <Column col={24}>
            <FlexRow>
              <Typography size="1" weight="medium" color={textColor}>
                Last Seen:
              </Typography>
              <Typography size="1" color={textColor}>
                {" " + getTimeSinceLastSeen(data.last_login_time)}
              </Typography>
            </FlexRow>
          </Column>
        </FlexRow> */}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default React.memo(UserListRow);
