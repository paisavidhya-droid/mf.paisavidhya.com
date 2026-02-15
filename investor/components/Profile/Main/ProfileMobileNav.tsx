import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";

import { useNavigation } from "@niveshstar/hook";
import { Button, FlexRow } from "@niveshstar/ui";

function ProfileMobileNav() {
  const { navigator, params } = useNavigation();

  const profileTab = params?.profileTab || "0";

  const handleNavigation = useCallback(
    (base: string, path: string, tab: string) => () => {
      navigator.navigate(base, path, { profileTab: tab });
    },
    [navigator]
  );

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <FlexRow colGap={8}>
          <Button
            title="Personal Details"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("profile", "main", "0")}
            variant={profileTab === "0" ? "soft" : "outline"}
          />

          <Button
            title="Address Details"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("profile", "main", "1")}
            variant={profileTab === "1" ? "soft" : "outline"}
          />

          <Button
            title="Contact Details"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("profile", "main", "7")}
            variant={profileTab === "1" ? "soft" : "outline"}
          />

          <Button
            title="Holder Details"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("profile", "main", "8")}
            variant={profileTab === "8" ? "soft" : "outline"}
          />

          <Button
            title="Nominee"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("profile", "main", "2")}
            variant={profileTab === "2" ? "soft" : "outline"}
          />

          <Button
            title="Bank Account"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("profile", "main", "3")}
            variant={profileTab === "3" ? "soft" : "outline"}
          />

          <Button
            title="BSE Details"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("profile", "main", "4")}
            variant={profileTab === "4" ? "soft" : "outline"}
          />

          <Button
            title="Password"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("profile", "main", "5")}
            variant={profileTab === "5" ? "soft" : "outline"}
          />

          <Button
            title="Risk Assessments"
            style={{ paddingVertical: 4 }}
            typographyProps={{ size: "1" }}
            onPress={handleNavigation("profile", "main", "6")}
            variant={profileTab === "6" ? "soft" : "outline"}
          />
        </FlexRow>
      </ScrollView>
    </View>
  );
}

export default React.memo(ProfileMobileNav);