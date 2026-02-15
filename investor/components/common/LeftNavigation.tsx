import React, { useCallback, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { colors, modeOptions, ThemeVariantType, variantOptions } from "@niveshstar/constant";
import { AppDispatch, logout, RootStateType, ThemeContext } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, ControlledRadio, CustomModal, FlexRow, Padding, Typography } from "@niveshstar/ui";
import { getAvatarInitials } from "@niveshstar/utils";

interface PropsType {
  closeModal?: () => void;
}

const defaultValues = {
  mode: { name: "", value: "" },
  variant: { name: "", value: "" },
};

function LeftNavigation(props: PropsType) {
  const { closeModal } = props;

  const dispatch = useDispatch<AppDispatch>();
  const { navigator } = useNavigation();
  const { themeColor, themeVariant, setTheme } = useContext(ThemeContext);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const authDetail = useSelector((state: RootStateType) => state.auth);

  const openThemeModal = useCallback(() => {
    setIsThemeModalOpen(true);
  }, []);
  const closeThemeModal = useCallback(() => {
    setIsThemeModalOpen(false);
  }, []);

  const applyTheme = useCallback(
    (data: typeof defaultValues) => {
      setTheme(data.mode.value === "light", data.variant.value as ThemeVariantType);
      closeThemeModal();
    },
    [setTheme, closeThemeModal]
  );

  const handleNavigation = useCallback(
    (base: string, path: string, state?: any) => () => {
      if (closeModal) closeModal();
      navigator.navigate(base, path, state);
    },
    [navigator, closeModal]
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logout());
  }, [dispatch]);

  return (
    <View style={[styles.contanier, { backgroundColor: themeColor.gray[1] }]}>
      <View style={{ flexGrow: 1 }}>
        <Button
          title="Home"
          color="neutral"
          typographyProps={{ weight: "light", color: themeColor.gray[12] }}
          variant="ghost"
          flexRowProps={{
            justifyContent: "flex-start",
            style: { width: "100%" },
          }}
          onPress={handleNavigation("home", "main")}
          icon={<AntDesign name="home" size={15} style={{ marginRight: 8 }} color={themeColor.gray[11]} />}
        />
        <Padding height={4} />

        <Button
          color="neutral"
          typographyProps={{ weight: "light", color: themeColor.gray[12] }}
          variant="ghost"
          title="Profile"
          flexRowProps={{
            justifyContent: "flex-start",
            style: { width: "100%" },
          }}
          onPress={handleNavigation("profile", "main")}
          icon={<AntDesign name="user" size={15} style={{ marginRight: 8 }} color={themeColor.gray[11]} />}
        />

        <View style={{ marginLeft: 20, paddingLeft: 2, borderLeftWidth: 1, borderColor: themeColor.gray[5] }}>
          <Button
            color="neutral"
            variant="ghost"
            typographyProps={{ weight: "light", color: themeColor.gray[12] }}
            title="Personal Info"
            flexRowProps={{
              justifyContent: "flex-start",
              style: { width: "100%" },
            }}
            style={{ paddingVertical: 2 }}
            onPress={handleNavigation("profile", "main", { profileTab: "0" })}
          />

          <Padding height={4} />

          <Button
            color="neutral"
            variant="ghost"
            typographyProps={{ weight: "light", color: themeColor.gray[12] }}
            title="Address Details"
            flexRowProps={{
              justifyContent: "flex-start",
              style: { width: "100%" },
            }}
            style={{ paddingVertical: 2 }}
            onPress={handleNavigation("profile", "main", { profileTab: "1" })}
          />

          <Padding height={4} />

          <Button
            color="neutral"
            variant="ghost"
            typographyProps={{ weight: "light", color: themeColor.gray[12] }}
            title="Contact Details"
            flexRowProps={{
              justifyContent: "flex-start",
              style: { width: "100%" },
            }}
            style={{ paddingVertical: 2 }}
            onPress={handleNavigation("profile", "main", { profileTab: "7" })}
          />

          <Padding height={4} />

          <Button
            color="neutral"
            variant="ghost"
            typographyProps={{ weight: "light", color: themeColor.gray[12] }}
            title="Holder Details"
            flexRowProps={{
              justifyContent: "flex-start",
              style: { width: "100%" },
            }}
            style={{ paddingVertical: 2 }}
            onPress={handleNavigation("profile", "main", { profileTab: "8" })}
          />

          <Padding height={4} />

          <Button
            color="neutral"
            variant="ghost"
            typographyProps={{ weight: "light", color: themeColor.gray[12] }}
            title="Nominee Details"
            flexRowProps={{
              justifyContent: "flex-start",
              style: { width: "100%" },
            }}
            style={{ paddingVertical: 2 }}
            onPress={handleNavigation("profile", "main", { profileTab: "2" })}
          />

          <Padding height={4} />

          <Button
            color="neutral"
            variant="ghost"
            typographyProps={{ weight: "light", color: themeColor.gray[12] }}
            title="Bank Account"
            flexRowProps={{
              justifyContent: "flex-start",
              style: { width: "100%" },
            }}
            style={{ paddingVertical: 2 }}
            onPress={handleNavigation("profile", "main", { profileTab: "3" })}
          />
          <Padding height={4} />

          <Button
            color="neutral"
            variant="ghost"
            typographyProps={{ weight: "light", color: themeColor.gray[12] }}
            title="BSE Details"
            flexRowProps={{
              justifyContent: "flex-start",
              style: { width: "100%" },
            }}
            style={{ paddingVertical: 2 }}
            onPress={handleNavigation("profile", "main", { profileTab: "4" })}
          />
          <Padding height={4} />

          <Button
            color="neutral"
            variant="ghost"
            typographyProps={{ weight: "light", color: themeColor.gray[12] }}
            title="Password"
            flexRowProps={{
              justifyContent: "flex-start",
              style: { width: "100%" },
            }}
            style={{ paddingVertical: 2 }}
            onPress={handleNavigation("profile", "main", { profileTab: "5" })}
          />
          <Padding height={4} />

          <Button
            color="neutral"
            variant="ghost"
            typographyProps={{ weight: "light", color: themeColor.gray[12] }}
            title="Risk Assessments"
            flexRowProps={{
              justifyContent: "flex-start",
              style: { width: "100%" },
            }}
            style={{ paddingVertical: 2 }}
            onPress={handleNavigation("profile", "main", { profileTab: "6" })}
          />
          <Padding height={4} />
        </View>
        <Padding height={4} />

        <Button
          color="neutral"
          variant="ghost"
          typographyProps={{ weight: "light", color: themeColor.gray[12] }}
          title="Mutual Funds"
          flexRowProps={{
            justifyContent: "flex-start",
            style: { width: "100%" },
          }}
          onPress={handleNavigation("home", "mutual-funds")}
          icon={<Entypo name="bar-graph" size={15} style={{ marginRight: 8 }} color={themeColor.gray[11]} />}
        />
        <Padding height={4} />

        <Button
          title="Cart"
          variant="ghost"
          typographyProps={{ weight: "light", color: themeColor.gray[12] }}
          color="neutral"
          flexRowProps={{
            justifyContent: "flex-start",
            style: { width: "100%" },
          }}
          onPress={handleNavigation("home", "cart")}
          icon={<Ionicons name="cart-outline" size={15} style={{ marginRight: 8 }} color={themeColor.gray[11]} />}
        />

        <Padding height={4} />

        <Button
          title="SIPs"
          color="neutral"
          typographyProps={{ weight: "light", color: themeColor.gray[12] }}
          variant="ghost"
          flexRowProps={{
            justifyContent: "flex-start",
            style: { width: "100%" },
          }}
          onPress={handleNavigation("home", "sip")}
          icon={<FontAwesome5 name="piggy-bank" size={15} style={{ marginRight: 8 }} color={themeColor.gray[11]} />}
        />
        <Padding height={4} />

        <Button
          title="Mandates"
          color="neutral"
          typographyProps={{ weight: "light", color: themeColor.gray[12] }}
          variant="ghost"
          flexRowProps={{
            justifyContent: "flex-start",
            style: { width: "100%" },
          }}
          onPress={handleNavigation("home", "mandate")}
          icon={<FontAwesome name="file-text" size={15} style={{ marginRight: 8 }} color={themeColor.gray[11]} />}
        />
        <Padding height={4} />

        {/* <Button
          title="More"
          color="neutral"
          typographyProps={{ weight: "light", color: themeColor.gray[12] }}
          variant="ghost"
          flexRowProps={{
            justifyContent: "flex-start",
            style: { width: "100%" },
          }}
          onPress={handleNavigation("home", "more")}
          icon={<AntDesign name="pluscircleo" size={15} style={{ marginRight: 8 }} color={themeColor.gray[11]} />}
        />
        <Padding height={4} /> */}

        {/* <Button
          variant="ghost"
          color="neutral"
          typographyProps={{ weight: "light", color: themeColor.gray[12] }}
          onPress={openThemeModal}
          flexRowProps={{
            justifyContent: "flex-start",
            style: { width: "100%" },
          }}
          title={`Theme: ${themeVariant[0] + themeVariant.slice(1).toLowerCase()}`}
          icon={<FontAwesome name="circle" size={15} style={{ marginRight: 8 }} color={themeColor.accent[9]} />}
        /> */}

        <Padding height={4} />

        <Button
          title="Logout"
          color="neutral"
          variant="ghost"
          typographyProps={{ weight: "light", color: themeColor.gray[12] }}
          flexRowProps={{
            justifyContent: "flex-start",
            style: { width: "100%" },
          }}
          onPress={handleLogout}
          icon={<Feather name="log-out" size={15} style={{ marginRight: 8 }} color={themeColor.gray[11]} />}
        />
      </View>

      <FlexRow style={{ paddingHorizontal: 4 }}>
        <View style={[styles.avatar, { backgroundColor: themeColor.accent[9] }]}>
          <Typography color={colors.white} weight="medium">
            {getAvatarInitials(authDetail?.firstName)}
          </Typography>
        </View>
        <Padding width={12} />
        <View>
          <Typography>{authDetail?.firstName}</Typography>
          <Typography size="1">{authDetail?.email || ""}</Typography>
        </View>
      </FlexRow>

      <CustomModal
        title="Theme"
        footerTitle="Apply"
        closeModal={closeThemeModal}
        isModalVisible={isThemeModalOpen}
        onConfirm={handleSubmit(applyTheme)}
      >
        <ControlledRadio name="mode" label="Mode" control={control} options={modeOptions} />
        <Padding height={16} />
        <ControlledRadio name="variant" label="Variant" control={control} options={variantOptions} />
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  contanier: {
    padding: 12,
    flexGrow: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(LeftNavigation);