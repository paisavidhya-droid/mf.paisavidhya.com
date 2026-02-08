import React, { useCallback, useContext, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import {
  RootStateType,
  ScreenContext,
  ThemeContext,
  useGetCartQuery,
  useGetPaymentOptionsQuery,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { BucketContainer, Button, CustomCard, CustomModal, Typography } from "@niveshstar/ui";
import FlexRow from "@niveshstar/ui/FlexRow";
import Padding from "@niveshstar/ui/Padding";

import CartItemList from "../../components/UserCart/CartItemList";
import CartTransaction from "../../components/UserCart/CartTransaction";

function UserCart() {
  const { navigator } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [isBucketModalVisible, setIsBucketModalVisible] = useState(false);

  const openBucketModal = useCallback(() => setIsBucketModalVisible(true), []);
  const closeBucketModal = useCallback(() => setIsBucketModalVisible(false), []);

  const { data: cartData = [], isLoading: isGettingCart } = useGetCartQuery(undefined, { skip: !authDetail.id });
  const { data: paymentData = [], isLoading: isGettingPayment } = useGetPaymentOptionsQuery(undefined, {
    skip: !authDetail.id,
  });

  const bankOptions = useMemo(() => {
    if (paymentData.length === 0) return [];
    return paymentData.map((val: any) => ({
      value: val,
      name: `${val.bank_name} - Acc No. ${val.account_number}`,
    }));
  }, [paymentData]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <CustomCard style={{ flexGrow: 1 }}>
        {isGettingCart || isGettingPayment ? (
          <FlexRow justifyContent="center" alignItems="center" style={{ flexGrow: 1 }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </FlexRow>
        ) : (
          <FlexRow colGap={16} rowGap={16} wrap>
            {cartData.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Typography>Kickstart Your investment journey</Typography>
                <Padding height={16} />
                <FlexRow colGap={16}>
                  <Button
                    variant="outline"
                    title="Explore Mutual Funds"
                    onPress={() => navigator.navigate("home", "mutual-funds")}
                  />
                  <Button variant="outline" title="Add Bucket" onPress={openBucketModal} />
                </FlexRow>
              </View>
            ) : null}

            {cartData.length !== 0 ? (
              <View style={{ flex: 1, alignSelf: "stretch" }}>
                <CartItemList data={cartData} />
                <Padding height={16} />
                <FlexRow justifyContent="center" colGap={16}>
                  <Button
                    variant="outline"
                    title="Add More Funds"
                    onPress={() => navigator.navigate("home", "mutual-funds")}
                  />
                  <Button variant="outline" title="Add Bucket" onPress={openBucketModal} />
                </FlexRow>
              </View>
            ) : null}

            <View
              style={{
                minWidth: 300,
                width: screenType === "sm" ? "100%" : 300,
                maxWidth: screenType === "sm" ? "100%" : 300,
              }}
            >
              <CartTransaction cartData={cartData} bankOptions={bankOptions} />
            </View>
          </FlexRow>
        )}
      </CustomCard>

      <CustomModal
        minWidth={650}
        heightPercent={80}
        title="Add Bucket"
        closeModal={closeBucketModal}
        isModalVisible={isBucketModalVisible}
      >
        <BucketContainer isParentAModal closeParentModal={closeBucketModal} />
      </CustomModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
  emptyContainer: {
    height: "100%",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(UserCart);
