import React, { useCallback, useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { AntDesign, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";

import { ScreenContext, ThemeContext } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, Column, CustomCard, FlexRow, Padding, Typography } from "@niveshstar/ui";

function Plans() {
  const { navigator } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);

  const handleNavigate = useCallback(
    (index: string) => () => {
      navigator.navigate("plans", "calculator", { index });
    },
    [navigator]
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <CustomCard style={{ flexGrow: 1 }}>
        <Typography size="5" weight="medium">
          Financial Plannings
        </Typography>
        <Padding height={24} />

        <FlexRow offset={8} rowGap={16} wrap alignItems="stretch">
          <Column col={screenType === "sm" ? 24 : 12} offset={8}>
            <Button
              title="Children's Education"
              variant="soft"
              color="neutral"
              typographyProps={{ align: "left" }}
              flexRowProps={{
                justifyContent: "flex-start",
                style: { width: "100%" },
              }}
              onPress={handleNavigate("0")}
              icon={<Ionicons color={themeColor.gray[11]} name="school" size={24} style={styles.iconMargin} />}
            />
          </Column>

          <Column col={screenType === "sm" ? 24 : 12} offset={8}>
            <Button
              title="Retirement Plan"
              variant="soft"
              color="neutral"
              typographyProps={{ align: "left" }}
              flexRowProps={{
                justifyContent: "flex-start",
                style: { width: "100%" },
              }}
              onPress={handleNavigate("1")}
              icon={<AntDesign color={themeColor.gray[11]} name="star" size={24} style={styles.iconMargin} />}
            />
          </Column>

          <Column col={screenType === "sm" ? 24 : 12} offset={8}>
            <Button
              title="Marriage Planner"
              variant="soft"
              color="neutral"
              typographyProps={{ align: "left" }}
              flexRowProps={{
                justifyContent: "flex-start",
                style: { width: "100%" },
              }}
              onPress={handleNavigate("2")}
              icon={<FontAwesome5 color={themeColor.gray[11]} name="gift" size={24} style={styles.iconMargin} />}
            />
          </Column>

          <Column col={screenType === "sm" ? 24 : 12} offset={8}>
            <Button
              title="House Purchase Plan"
              variant="soft"
              color="neutral"
              typographyProps={{ align: "left" }}
              flexRowProps={{
                justifyContent: "flex-start",
                style: { width: "100%" },
              }}
              onPress={handleNavigate("3")}
              icon={<FontAwesome color={themeColor.gray[11]} name="home" size={24} style={styles.iconMargin} />}
            />
          </Column>

          <Column col={screenType === "sm" ? 24 : 12} offset={8}>
            <Button
              title="Dream Planner"
              variant="soft"
              color="neutral"
              typographyProps={{ align: "left" }}
              flexRowProps={{
                justifyContent: "flex-start",
                style: { width: "100%" },
              }}
              onPress={handleNavigate("4")}
              icon={<FontAwesome5 color={themeColor.gray[11]} name="trophy" size={20} style={styles.iconMargin} />}
            />
          </Column>
        </FlexRow>
      </CustomCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
  iconMargin: {
    marginRight: 8,
  },
});

export default React.memo(Plans);
