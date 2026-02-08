import React, { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";

import { ThemeContext } from "@niveshstar/context";
import { CustomCard, FlexRow, Padding, Typography } from "@niveshstar/ui";
import { convertCurrencyToString } from "@niveshstar/utils";

interface PropsType {
  data: any;
}

export default function FlowMandateForm(props: PropsType) {
  const { data } = props;

  const { themeColor } = useContext(ThemeContext);

  return (
    <View>
      <Typography size="4" weight="medium">
        Setup AutoPay now
      </Typography>
      <Padding height={16} />

      <Typography>With AutoPay, SIP investments are made automatically from your preferred bank.</Typography>
      <Padding height={16} />

      <CustomCard>
        <Typography align="center">Autopay Limit</Typography>
        <Typography size="3" weight="bold" align="center">
          {convertCurrencyToString(data.mandate_limit)}
        </Typography>
      </CustomCard>
      <Padding height={16} />

      <CustomCard>
        <FlexRow justifyContent="center">
          <Image
            source={{ uri: data.bank_img_url }}
            style={{
              width: 30,
              height: 30,
            }}
            resizeMode="stretch"
            resizeMethod="scale"
          />
          <Padding width={16} />
          <View>
            <Typography>{data.bank_name}</Typography>
            <Padding height={8} />
            <Typography>{data.account_number}</Typography>
            <Padding height={8} />
            <Typography>IFSC: {data.ifsc_code}</Typography>
          </View>
        </FlexRow>
      </CustomCard>

      <Padding height={16} />

      <View style={[style.banner, { backgroundColor: themeColor.green[3] }]}>
        <Typography align="center" weight="medium">
          Amount debited will be your SIP amount and not the max limit you have set.
        </Typography>
      </View>

      <Padding height={16} />

      <CustomCard>
        <Typography weight="medium">What's Next?</Typography>
        <Padding height={16} />

        <Typography>
          After confirmation, you will be redirected to the netbanking page for AutoPay registration.
        </Typography>
        <Padding height={8} />

        <Typography>Confirm your details</Typography>
        <Padding height={8} />

        <Typography>Login via Netbanking/Debit Card</Typography>
        <Padding height={8} />

        <Typography>Authenticate on the bank site</Typography>
      </CustomCard>
    </View>
  );
}

const style = StyleSheet.create({
  logo: {
    width: 30,
    height: 30,
  },
  banner: {
    padding: 12,
    borderRadius: 6,
  },
});
