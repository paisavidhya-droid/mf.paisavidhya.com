import React, { useCallback, useContext, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@niveshstar/constant";
import { PLatformUtil, ThemeContext } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { FlexRow, Padding, Typography } from "@niveshstar/ui";

import LeftNavigation from "./LeftNavigation";

const logoImg = Asset.fromModule(require("@niveshstar/assets/img/logo-blue.jpg")).uri;

interface PropsType {
  title?: string;
}

function Navbar(props: PropsType) {
  const { title } = props;
  const { navigator } = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const { themeColor } = useContext(ThemeContext);

  const [isMenuOpen, setIsMenuOepn] = useState(false);

  const handleNavigate = useCallback(
    (base: string, path: string) => () => {
      navigator.navigate(base, path);
    },
    [navigator]
  );

  const handleToggle = useCallback(() => {
    setIsMenuOepn((prev) => !prev);
  }, []);

  return (
    <View style={[style.wrapper, { backgroundColor: themeColor.accent[9] }]}>
      <FlexRow justifyContent="space-between" alignItems="center">
        {title ? (
          <Typography size="3" weight="medium" color={colors.white}>
            {title}
          </Typography>
        ) : (
          <Pressable onPress={handleNavigate("home", "main")}>
            <Image style={style.logo} resizeMode="stretch" resizeMethod="scale" source={{ uri: logoImg }} />
          </Pressable>
        )}
        <FlexRow style={{ flex: 1 }} justifyContent="flex-end">
          <Pressable onPress={handleNavigate("home", "cart")}>
            <Ionicons name="cart-outline" size={22} color={colors.white} />
          </Pressable>
          <Padding width={24} />
          <Pressable onPress={handleToggle}>
            <Feather name="menu" size={22} color={colors.white} />
          </Pressable>
        </FlexRow>
      </FlexRow>

      <Modal
        useNativeDriver
        backdropOpacity={1}
        propagateSwipe={false}
        isVisible={isMenuOpen}
        animationIn="slideInRight"
        useNativeDriverForBackdrop
        animationOut="slideOutRight"
        onBackdropPress={handleToggle}
        onBackButtonPress={handleToggle}
        hideModalContentWhileAnimating={true}
        backdropColor={themeColor.gray["a9"]}
        style={{ alignItems: "flex-end", margin: 0 }}
        backdropTransitionInTiming={PLatformUtil.isMobile ? 0 : 300}
        backdropTransitionOutTiming={PLatformUtil.isMobile ? 1 : 300}
      >
        <View style={style.modal}>
          <View style={[style.menu, { backgroundColor: themeColor.gray[1], paddingTop: top, paddingBottom: bottom }]}>
            <FlexRow justifyContent="flex-end" style={{ paddingEnd: 20 }}>
              <Pressable onPress={handleToggle}>
                <AntDesign name="close" size={20} color={themeColor.gray[11]} />
              </Pressable>
            </FlexRow>
            <LeftNavigation closeModal={handleToggle} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const style = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modal: {
    flex: 1,
    width: "80%",
    maxWidth: 320,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  menu: {
    width: "100%",
    height: "100%",
    paddingTop: 10,
  },
  logo: {
    width: 120,
    height: 24,
  },
});

export default React.memo(Navbar);
