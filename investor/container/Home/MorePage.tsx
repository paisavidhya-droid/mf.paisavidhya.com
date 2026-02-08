import React, { useCallback, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { AntDesign, FontAwesome, FontAwesome5, Foundation } from "@expo/vector-icons";

import { ScreenContext, ThemeContext } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, Column, CustomCard, FlexRow } from "@niveshstar/ui";

function MorePage() {
  const { navigator } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);

  const handleNavigation = useCallback(
    (base: string, path: string, state?: any) => () => {
      navigator.navigate(base, path, state);
    },
    [navigator]
  );

  return (
    <View style={[styles.conatiner, { backgroundColor: themeColor.gray[1] }]}>
      <CustomCard style={{ flexGrow: 1 }}>
        <FlexRow offset={8} rowGap={16} wrap alignItems="stretch">
          <Column offset={8} col={screenType === "sm" ? 24 : 12}>
            <Button
              title="SIPs"
              variant="soft"
              color="neutral"
              typographyProps={{ align: "left" }}
              flexRowProps={{
                justifyContent: "flex-start",
                style: { width: "100%" },
              }}
              onPress={handleNavigation("home", "sip")}
              icon={<FontAwesome5 color={themeColor.gray[11]} name="piggy-bank" size={24} style={styles.iconMargin} />}
            />
          </Column>

          <Column offset={8} col={screenType === "sm" ? 24 : 12}>
            <Button
              title="Mandates"
              variant="soft"
              color="neutral"
              typographyProps={{ align: "left" }}
              flexRowProps={{
                justifyContent: "flex-start",
                style: { width: "100%" },
              }}
              onPress={handleNavigation("home", "mandate")}
              icon={<FontAwesome color={themeColor.gray[11]} name="file-text" size={24} style={styles.iconMargin} />}
            />
          </Column>

          <Column offset={8} col={screenType === "sm" ? 24 : 12}>
            <Button
              title="Holdings"
              variant="soft"
              color="neutral"
              typographyProps={{ align: "left" }}
              flexRowProps={{
                justifyContent: "flex-start",
                style: { width: "100%" },
              }}
              onPress={handleNavigation("home", "holdings")}
              icon={<AntDesign color={themeColor.gray[11]} name="piechart" size={24} style={styles.iconMargin} />}
            />
          </Column>

          <Column offset={8} col={screenType === "sm" ? 24 : 12}>
            <Button
              title="Plans"
              variant="soft"
              color="neutral"
              typographyProps={{ align: "left" }}
              flexRowProps={{
                justifyContent: "flex-start",
                style: { width: "100%" },
              }}
              onPress={handleNavigation("plans", "main")}
              icon={<FontAwesome5 color={themeColor.gray[11]} name="th-list" size={24} style={styles.iconMargin} />}
            />
          </Column>

          <Column offset={8} col={screenType === "sm" ? 24 : 12}>
            <Button
              title="Portfolio Tracker"
              variant="soft"
              color="neutral"
              typographyProps={{ align: "left" }}
              flexRowProps={{
                justifyContent: "flex-start",
                style: { width: "100%" },
              }}
              onPress={handleNavigation("home", "import")}
              icon={<Foundation color={themeColor.gray[11]} name="target-two" size={24} style={styles.iconMargin} />}
            />
          </Column>
        </FlexRow>
      </CustomCard>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flexGrow: 1,
    padding: 12,
  },
  iconMargin: {
    marginRight: 8,
  },
});

export default React.memo(MorePage);
