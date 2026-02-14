import React, { useCallback, useContext, useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { dropDownValueType } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";

import Button from "./Button";
import FlexRow from "./FlexRow";
import InputField from "./InputField";
import Padding from "./Padding";
import Typography from "./Typography";

interface PropsType {
  label: string;
  options: dropDownValueType[];
  control: Control<any>;
  name: string;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
  placeholder?: string;
  disabled?: boolean;
  height?: number;
}

function ControlledDropDown(props: PropsType) {
  const { label, options, name, control, rules = {}, placeholder, disabled = false, height = 300 } = props;

  const { height: windowHeight } = Dimensions.get("window");
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { themeColor } = useContext(ThemeContext);

  const isPressed = useSharedValue(false);
  const offset = useSharedValue(windowHeight - height);

  const openOptionsModal = useCallback(() => {
    setIsOptionsModalOpen(true);
  }, []);

  const closeOptionsModal = useCallback(() => {
    setIsOptionsModalOpen(false);
    setSearchQuery("");
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((option) => option.name.toString().toLowerCase().includes(searchQuery.toLowerCase()));
  }, [options, searchQuery]);

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
    <Controller
      control={control}
      name={name}
      rules={{
        ...rules,
        validate: (v: dropDownValueType) => {
          if (!rules?.required) return true;
          if (typeof rules.required === "object" && !rules.required.value) return true;
          if (v.value === 0) return true;
          if (!v.value && typeof rules.required === "object") return rules?.required?.message;
          // if (!v.value) return "Please select an option";
          if (rules.validate && typeof rules.validate === "function") return rules.validate(v, null);
          return true;
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <View>
            {label ? (
              <Typography style={{ marginBottom: 4 }}>
                {label}
                {typeof rules.required === "object" && rules.required.value ? (
                  <Typography color={themeColor.red[11]}> *</Typography>
                ) : null}
              </Typography>
            ) : null}

            <View style={styles.container}>
              <Pressable onPress={openOptionsModal} style={styles.modalTrigger} disabled={disabled} />
              <InputField error={error} placeholder={placeholder} disabled={disabled} value={value.name.toString()} />
            </View>

            <Modal
              avoidKeyboard
              useNativeDriver
              backdropOpacity={1}
              animationIn="fadeInUp"
              propagateSwipe={false}
              animationOut="fadeOutDown"
              useNativeDriverForBackdrop
              isVisible={isOptionsModalOpen}
              backdropTransitionInTiming={0}
              backdropTransitionOutTiming={1}
              onBackdropPress={closeOptionsModal}
              hideModalContentWhileAnimating={true}
              onBackButtonPress={closeOptionsModal}
              backdropColor={themeColor.gray["a9"]}
              style={{ justifyContent: "flex-end", margin: 0 }}
            >
              <GestureHandlerRootView style={{ flexGrow: 1, justifyContent: "flex-end" }}>
                <Animated.View
                  style={[
                    styles.modalContainer,
                    {
                      backgroundColor: themeColor.gray[1],
                      height: windowHeight,
                    },
                    animatedStyles,
                  ]}
                >
                  <FlexRow justifyContent="center">
                    <GestureDetector gesture={gesture}>
                      <View style={{ width: 120, paddingVertical: 12 }}>
                        <View style={[styles.handle, { backgroundColor: themeColor.gray[6] }]} />
                      </View>
                    </GestureDetector>
                  </FlexRow>
                  <Padding height={40} />

                  <Button
                    hitSlop={10}
                    title="Close"
                    variant="ghost"
                    style={styles.closeButton}
                    onPress={closeOptionsModal}
                  />

                  <FlexRow style={[styles.searchContainer, { backgroundColor: themeColor.gray[3] }]}>
                    <Entypo name="magnifying-glass" size={20} color={themeColor.gray[9]} />
                    <TextInput
                      value={searchQuery}
                      placeholder="Search..."
                      onChangeText={setSearchQuery}
                      placeholderTextColor={themeColor.gray[9]}
                      style={[styles.searchInput, { color: themeColor.gray[12] }]}
                    />
                  </FlexRow>

                  <View style={{ height: height - 135 }}>
                    <FlashList
                      persistentScrollbar
                      data={filteredOptions}
                      keyExtractor={(item) => item.name.toString()}
                      ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                      renderItem={({ item }: { item: dropDownValueType }) => (
                        <Pressable
                          style={({ pressed }) => [
                            styles.optionItem,
                            {
                              opacity: pressed ? 0.4 : 1,
                              backgroundColor: value?.name === item.name ? themeColor.accent[4] : themeColor.gray[3],
                            },
                          ]}
                          onPress={() => {
                            onChange(item);
                            closeOptionsModal();
                          }}
                        >
                          <Typography>{item.name}</Typography>
                        </Pressable>
                      )}
                      ListEmptyComponent={
                        <View style={styles.emptyState}>
                          <Typography size="3">No options found</Typography>
                        </View>
                      }
                    />
                  </View>
                </Animated.View>
              </GestureHandlerRootView>
            </Modal>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  modalTrigger: {
    position: "absolute",
    top: 0,
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
    borderRadius: 12,
    zIndex: 2,
  },
  modalContainer: {
    position: "relative",
    padding: 16,
    paddingTop: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  searchInput: {
    flexGrow: 1,
    marginLeft: 8,
    fontSize: 16,
    padding: 0,
  },
  optionItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 3,
  },
  emptyState: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(ControlledDropDown);
