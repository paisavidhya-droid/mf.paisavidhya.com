import React, { useCallback, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Menu, MenuItem } from "react-native-material-menu";

import { ThemeContext } from "@niveshstar/context";

import Button from "../../Button";
import Typography from "../../Typography";

interface PropsType {
  index: number;
  selectScheme: (index: number, purpose: "TRANSACTION" | "LUMPSUM" | "REDEEM") => void;
}

export default function HoldingsMenu(props: PropsType) {
  const { selectScheme, index } = props;
  const { themeColor } = useContext(ThemeContext);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const openMenu = useCallback(() => {
    setIsMenuVisible(true);
  }, []);
  const closeMenu = useCallback(() => {
    setIsMenuVisible(false);
  }, []);

  return (
    <Menu
      visible={isMenuVisible}
      onRequestClose={closeMenu}
      style={{
        ...styles.menuContainer,
        shadowColor: themeColor.gray["a5"],
      }}
      anchor={
        <Button
          variant="ghost"
          color="neutral"
          onPress={openMenu}
          icon={<Entypo name="dots-three-vertical" color={themeColor.gray[12]} size={16} />}
        />
      }
    >
      <View
        style={[
          styles.menuContent,
          {
            backgroundColor: themeColor.gray[1],
            borderColor: themeColor.gray[6],
          },
        ]}
      >
        <MenuItem
          style={{ ...styles.menuItem, borderColor: themeColor.gray[6] }}
          textStyle={styles.textContainer}
          onPress={() => {
            selectScheme(index, "TRANSACTION");
            closeMenu();
          }}
        >
          <Typography>Transaction</Typography>
        </MenuItem>

        {/* <MenuItem
          style={{ ...styles.menuItem, borderColor: themeColor.gray[6] }}
          textStyle={styles.textContainer}
          onPress={() => {
            selectScheme(index, "LUMPSUM");
            closeMenu();
          }}
        >
          <Typography>Lumpsum</Typography>
        </MenuItem> */}

        <MenuItem
          style={{
            ...styles.menuItem,
            borderColor: themeColor.gray[6],
            borderBottomWidth: 0,
            paddingBottom: 0,
          }}
          textStyle={styles.textContainer}
          onPress={() => {
            selectScheme(index, "REDEEM");
            closeMenu();
          }}
        >
          <Typography>Redeem</Typography>
        </MenuItem>

        {/* <MenuItem
          style={{ ...styles.menuItem, borderColor: themeColor.gray[6] }}
          textStyle={styles.textContainer}
          onPress={() => {
            selectScheme(index, "stp");
            closeMenu();
          }}
        >
          <Typography>STP</Typography>
        </MenuItem>

        <MenuItem
          style={{ ...styles.menuItem, borderColor: themeColor.gray[6] }}
          textStyle={styles.textContainer}
          onPress={() => {
            selectScheme(index, "swp");
            closeMenu();
          }}
        >
          <Typography>SWP</Typography>
        </MenuItem>

        <MenuItem
          style={{
            ...styles.menuItem,
            borderColor: themeColor.gray[6],
            borderBottomWidth: 0,
            paddingBottom: 0,
          }}
          textStyle={styles.textContainer}
          onPress={() => {
            selectScheme(index, "switch");
            closeMenu();
          }}
        >
          <Typography>Switch</Typography>
        </MenuItem> */}
      </View>
    </Menu>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    borderRadius: 14,
    shadowOpacity: 1,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    elevation: 6,
    shadowRadius: 6,
  },
  menuContent: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 5,
  },
  menuItem: {
    minHeight: 32,
    height: 32,
    paddingBottom: 4,
    borderBottomWidth: 1,
  },
  textContainer: {
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
});
