import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import moment from "moment";

import { ThemeContext } from "@niveshstar/context";
import { convertCurrencyToString, getOrderStatusDisplay } from "@niveshstar/utils";

import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

function RecentOrderRow({ data }) {
  const { themeColor, isLight } = useContext(ThemeContext);
  const orderStatus = getOrderStatusDisplay(data.status, isLight);

  return (
    <View style={{ paddingVertical: 12 }}>
      <FlexRow>
        <View style={{ flex: 1 }}>
          <Typography>{data.scheme.name}</Typography>
        </View>
        <Padding width={16} />
        <Typography weight="medium" size="3">
          {data.is_units ? `${data.amount} Units` : convertCurrencyToString(data.amount)}
        </Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow alignItems="center" justifyContent="space-between">
        <Typography size="1" weight="light" color={themeColor.gray[11]}>
          {moment(data.created_at).format("DD MMM YYYY")}
          &nbsp; | &nbsp;
          {data.order_type}
        </Typography>
        <View style={[styles.bubble, { backgroundColor: orderStatus.bg }]}>
          <Typography size="1" weight="light" color={orderStatus.text}>
            {orderStatus.label}
          </Typography>
        </View>
      </FlexRow>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
});

export default React.memo(RecentOrderRow);
