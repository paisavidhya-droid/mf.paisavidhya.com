import React, { useContext, useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { ThemeContext, useGetCartWithTokenQuery, useGetPaymentWithTokenQuery } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { FlexRow } from "@niveshstar/ui";

import FlowForm from "../../components/Flow/FlowForm";

function Flow() {
  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);

  const { data: cartData = [], isLoading: isGettingCart } = useGetCartWithTokenQuery({
    accessToken: params?.key,
  });

  const { data: paymentData = [], isLoading: isGettingPayment } = useGetPaymentWithTokenQuery({
    accessToken: params?.key,
  });

  const bankOptions = useMemo(() => {
    if (paymentData.length === 0) return [];
    return paymentData.map((val: any) => ({
      value: val,
      name: `${val.bank_name} - Acc No. ${val.account_number}`,
    }));
  }, [paymentData]);

  return (
    <ScrollView contentContainerStyle={[style.container, { backgroundColor: themeColor.gray[1] }]}>
      <View style={style.wrapper}>
        {isGettingCart || isGettingPayment ? (
          <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </FlexRow>
        ) : null}
        {!isGettingCart && !isGettingPayment && cartData ? (
          <FlowForm cartData={cartData} bankOptions={bankOptions} />
        ) : null}
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
  wrapper: {
    flexGrow: 1,
    padding: 12,
  },
});

export default React.memo(Flow);
