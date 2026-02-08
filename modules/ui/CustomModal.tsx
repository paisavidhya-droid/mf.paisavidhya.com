import React, { useContext, useMemo } from "react";
import { Dimensions, DimensionValue, ScrollView, StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { PLatformUtil, ScreenContext, ThemeContext } from "@niveshstar/context";
import { toastConfig } from "@niveshstar/utils";

import Button, { ButtonPropsType } from "./Button";
import FlexRow from "./FlexRow";
import Padding from "./Padding";
import Typography from "./Typography";

interface PropsType {
  isModalVisible: boolean;
  closeModal: () => void;
  title?: string;
  footerTitle?: string;
  onConfirm?: () => void;
  children: React.ReactNode;
  maxWidth?: DimensionValue;
  minWidth?: DimensionValue;
  heightPercent?: number;
  primaryBtnProps?: Omit<ButtonPropsType, "title" | "onPress">;
  secondaryBtnProps?: Omit<ButtonPropsType, "title" | "onPress">;
}

function CustomModal(props: PropsType) {
  const {
    isModalVisible,
    closeModal,
    title,
    footerTitle,
    onConfirm,
    maxWidth = 600,
    minWidth = 360,
    heightPercent = 50,
    children,
    primaryBtnProps = {},
    secondaryBtnProps = {},
  } = props;

  const { top, bottom } = useSafeAreaInsets();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const { height: windowHeight } = Dimensions.get("window");

  const height = useMemo(() => {
    return Math.floor((windowHeight * heightPercent) / 100);
  }, [windowHeight, heightPercent]);

  const isPressed = useSharedValue(false);
  const offset = useSharedValue(screenType === "sm" ? windowHeight - height : 0);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      offset.value = e.translationY + windowHeight - height;
    })
    .onEnd(() => {
      offset.value = withSpring(windowHeight - height, {
        stiffness: 300,
        damping: 15,
      });
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  return (
    <Modal
      avoidKeyboard
      useNativeDriver
      backdropOpacity={1}
      propagateSwipe={false}
      useNativeDriverForBackdrop
      isVisible={isModalVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      hideModalContentWhileAnimating={true}
      backdropColor={themeColor.gray["a9"]}
      backdropTransitionInTiming={PLatformUtil.isMobile ? 0 : 300}
      backdropTransitionOutTiming={PLatformUtil.isMobile ? 1 : 300}
      style={screenType === "sm" ? { justifyContent: "flex-end", margin: 0 } : { justifyContent: "center", margin: 0 }}
    >
      <GestureHandlerRootView
        style={{
          flexGrow: 1,
          width: "100%",
          paddingTop: top,
          paddingBottom: bottom,
        }}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              margin: "auto",
              backgroundColor: themeColor.gray[1],
              width: screenType === "sm" ? "100%" : "auto",
              height: screenType === "sm" ? windowHeight : "auto",
              maxWidth: screenType === "sm" ? "100%" : maxWidth,
              minWidth: screenType === "sm" ? "100%" : minWidth,
              borderBottomLeftRadius: screenType === "sm" ? 0 : 6,
              borderBottomRightRadius: screenType === "sm" ? 0 : 6,
              borderTopLeftRadius: screenType === "sm" ? 12 : 6,
              borderTopRightRadius: screenType === "sm" ? 12 : 6,
              paddingVertical: screenType === "sm" ? 0 : 12,
            },
            animatedStyles,
          ]}
        >
          {screenType === "sm" ? (
            <>
              <FlexRow justifyContent="center">
                <GestureDetector gesture={gesture}>
                  <View style={styles.handleContainer}>
                    <View style={[styles.handle, { backgroundColor: themeColor.gray[6] }]} />
                  </View>
                </GestureDetector>
              </FlexRow>

              <Padding height={4} />
            </>
          ) : null}

          <Button
            onPress={closeModal}
            variant="soft"
            color="neutral"
            style={styles.closeButton}
            icon={<AntDesign name="close" size={18} color={themeColor.gray[11]} />}
          />

          <Typography weight="bold" size="5" style={{ paddingHorizontal: 16 }}>
            {title}
          </Typography>
          <Padding height={16} />
          <View style={[{ maxHeight: windowHeight - 142 }, screenType === "sm" ? { height: height - 142 } : {}]}>
            <ScrollView style={styles.body}>{children}</ScrollView>
          </View>
          <Padding height={16} />
          <FlexRow justifyContent="flex-end" style={{ paddingHorizontal: 16 }}>
            <Button title="Close" onPress={closeModal} variant="outline" color="neutral" {...secondaryBtnProps} />
            {footerTitle ? (
              <>
                <Padding width={8} />
                <Button title={footerTitle} onPress={onConfirm} {...primaryBtnProps} />
              </>
            ) : null}
          </FlexRow>
        </Animated.View>
      </GestureHandlerRootView>
      {isModalVisible ? <Toast config={toastConfig} /> : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: "relative",
  },
  handleContainer: {
    width: 120,
    paddingVertical: 12,
  },
  handle: {
    width: 120,
    height: 4,
    borderRadius: 2,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 30,
    zIndex: 5,
  },
  body: {
    paddingHorizontal: 16,
  },
});

export default React.memo(CustomModal);
