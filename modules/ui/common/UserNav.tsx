import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";

import { useNavigation } from "@niveshstar/hook";

import Button from "../Button";
import FlexRow from "../FlexRow";

function UserNav() {
  const { navigator, params } = useNavigation();
  const currUserTab = params.userTab || "0";

  const handleNavigation = useCallback(
    (base: string, tab: string) => () => {
      navigator.navigate(base, "user", {
        investorId: params.investorId,
        userTab: tab,
      });
    },
    [navigator, params]
  );

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <FlexRow colGap={8}>
          <Button
            title="Overview"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "0")}
            variant={currUserTab === "0" ? "soft" : "outline"}
          />

          <Button
            title="Profile"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "1")}
            variant={currUserTab === "1" ? "soft" : "outline"}
          />

          {/* <Button
            title="Stats"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "11")}
            variant={currUserTab === "11" ? "soft" : "outline"}
          /> */}

          <Button
            title="Investor Risk Profiling"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "2")}
            variant={currUserTab === "2" ? "soft" : "outline"}
          />

          <Button
            title="Mandates"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "3")}
            variant={currUserTab === "3" ? "soft" : "outline"}
          />

          <Button
            title="Cart"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "4")}
            variant={currUserTab === "4" ? "soft" : "outline"}
          />

          <Button
            title="All Orders"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "5")}
            variant={currUserTab === "5" ? "soft" : "outline"}
          />

          <Button
            title="SIPs"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "6")}
            variant={currUserTab === "6" ? "soft" : "outline"}
          />

          {/* <Button
            title="CAS Import"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "7")}
            variant={currUserTab === "7" ? "soft" : "outline"}
          />

          <Button
            title="Notes"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "8")}
            variant={currUserTab === "8" ? "soft" : "outline"}
          /> */}

          <Button
            title="Mutual Funds"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("home", "9")}
            variant={currUserTab === "9" ? "soft" : "outline"}
          />
        </FlexRow>
      </ScrollView>
    </View>
  );
}

export default React.memo(UserNav);
