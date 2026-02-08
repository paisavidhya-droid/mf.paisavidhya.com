import React, { useCallback, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Menu, MenuItem } from "react-native-material-menu";
import { useSelector } from "react-redux";

import { RootStateType, ScreenContext, ThemeContext } from "@niveshstar/context";

import Button from "../../Button";
import Column from "../../Column";
import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

interface PropsType {
  data: any;
  allowPurchase?: boolean;
  selectBucket: (bucket: any, purpose: "DELETE" | "EDIT" | "PURCHASE" | "RETURNS") => void;
}

function BucketList(props: PropsType) {
  const { data, selectBucket, allowPurchase = false } = props;

  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const [isMenuVisible, setIsMenuVisible] = useState(-1);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const openMenu = useCallback((index: number) => {
    setIsMenuVisible(index);
  }, []);
  const closeMenu = useCallback(() => {
    setIsMenuVisible(-1);
  }, []);

  const handleSelectBucket = useCallback(
    (index: number, purpose: "DELETE" | "EDIT" | "PURCHASE" | "RETURNS") => () => {
      closeMenu();
      selectBucket(index, purpose);
    },
    [selectBucket, closeMenu]
  );

  return (
    <>
      <FlexRow offset={16} rowGap={16} wrap>
        {data.map((val: any, i: number) => (
          <Column offset={16} col={screenType === "sm" || allowPurchase ? 24 : 12} key={i}>
            <CustomCard style={{ backgroundColor: themeColor.gray[3] }}>
              <FlexRow>
                <View>
                  <Typography size="3" weight="medium">
                    {val.title}
                  </Typography>
                  <Padding height={8} />
                  <FlexRow>
                    <Typography size="1" color={themeColor.gray[10]}>
                      {val.risk_level}
                    </Typography>
                    <Padding width={8} />
                    <Typography size="1" color={themeColor.gray[10]}>
                      |
                    </Typography>
                    <Padding width={8} />
                    <Typography size="1" color={themeColor.gray[10]}>
                      {val.investment_mode}
                    </Typography>
                  </FlexRow>
                </View>
                <FlexRow style={{ flexGrow: 1 }} justifyContent="flex-end">
                  {allowPurchase ? (
                    <Button variant="soft" title="Add to Cart" onPress={handleSelectBucket(i, "PURCHASE")} />
                  ) : null}
                  {authDetail.userType === "investor" || allowPurchase ? null : (
                    <>
                      <Padding width={10} />
                      <Menu
                        onRequestClose={closeMenu}
                        visible={isMenuVisible === i}
                        style={{
                          maxHeight: 75,
                          borderRadius: 14,
                          shadowColor: themeColor.gray["a5"],
                          shadowOpacity: 1,
                          shadowOffset: {
                            width: 2,
                            height: 4,
                          },
                          elevation: 6,
                          shadowRadius: 6,
                        }}
                        anchor={
                          <Button
                            variant="ghost"
                            color="neutral"
                            onPress={() => openMenu(i)}
                            icon={<Entypo name="dots-three-vertical" color={themeColor.gray[12]} size={16} />}
                          />
                        }
                      >
                        <View
                          style={[
                            styles.menuContainer,
                            {
                              backgroundColor: themeColor.gray[1],
                              borderColor: themeColor.gray[6],
                            },
                          ]}
                        >
                          {/* <MenuItem
                            onPress={handleSelectBucket(i, "EDIT")}
                            style={{ ...styles.menuItem, borderColor: themeColor.gray[6] }}
                            textStyle={styles.textContainer}
                          >
                            <Typography>Edit</Typography>
                          </MenuItem> */}
                          <MenuItem
                            onPress={handleSelectBucket(i, "DELETE")}
                            textStyle={styles.textContainer}
                            style={{
                              ...styles.menuItem,
                              borderBottomWidth: 0,
                              paddingBottom: 0,
                            }}
                          >
                            <Typography>Delete</Typography>
                          </MenuItem>
                        </View>
                      </Menu>
                    </>
                  )}
                </FlexRow>
              </FlexRow>

              <Padding height={16} />
              <Typography size="1" color={themeColor.gray[11]}>
                {val.description}
              </Typography>
              <Padding height={16} />
              <Typography size="2" weight="medium" color={themeColor.gray[12]}>
                Schemes:
              </Typography>
              <Padding height={8} />
              {val.bucket_schemes.map((bucketScheme: any, index: number) => (
                <FlexRow key={index} alignItems="center">
                  <Typography size="1" color={themeColor.gray[10]}>
                    {index + 1}. {bucketScheme.scheme.name}
                  </Typography>
                  <Padding width={8} />
                  <Typography size="1" color={themeColor.accent[9]}>
                    ({bucketScheme.allocation_perc}%)
                  </Typography>
                </FlexRow>
              ))}
              <Padding height={16} />
            </CustomCard>
          </Column>
        ))}
      </FlexRow>
    </>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
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
  footer: {
    padding: 8,
    borderRadius: 6,
    paddingHorizontal: 12,
  },
});

export default React.memo(BucketList);
