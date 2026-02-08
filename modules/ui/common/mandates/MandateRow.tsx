import React, { useContext } from "react";
import { Image, View } from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext } from "@niveshstar/context";
import { convertCurrencyToString, getMandateStatusDisplay } from "@niveshstar/utils";

import Button from "../../Button";
import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

interface PropsType {
  data: any;
  handleSelectMandate: (data: any, purpose: "delete" | "details" | "link") => void;
}

function MandateRow(props: PropsType) {
  const { data, handleSelectMandate } = props;

  const authDetail = useSelector((state: RootStateType) => state.auth);
  const { themeColor, isLight } = useContext(ThemeContext);

  const mandateStatus = getMandateStatusDisplay(data.status, isLight);

  return (
    <CustomCard style={{ flexGrow: 1, backgroundColor: themeColor.gray[3] }}>
      <FlexRow justifyContent="space-between" alignItems="center">
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 6,
            borderRadius: 4,
            backgroundColor: mandateStatus.bg,
          }}
        >
          <Typography size="1" weight="light" color={mandateStatus.text}>
            {mandateStatus.label}
          </Typography>
        </View>
        {/* <Button
          variant="soft"
          color="danger"
          onPress={() => handleSelectMandate(data.id, "delete")}
          icon={<FontAwesome name="trash-o" size={18} color={themeColor.red[9]} />}
        /> */}
      </FlexRow>
      <Padding height={16} />

      <Typography size="1">Start Date: {moment(data.start_date).format("D MMMM YYYY")}</Typography>
      <Padding height={8} />
      <Typography size="1">Linked SIP: {data.linked_sxp}</Typography>
      <Padding height={16} />

      <CustomCard>
        <Typography align="center">Amount</Typography>
        <Typography size="3" weight="bold" align="center">
          {convertCurrencyToString(data.amount)}
        </Typography>
      </CustomCard>
      <Padding height={16} />

      <CustomCard>
        <FlexRow justifyContent="center">
          <Image
            source={{ uri: data.bank_account.bank_img_url }}
            style={{
              width: 30,
              height: 30,
            }}
            resizeMode="stretch"
            resizeMethod="scale"
          />
          <Padding width={16} />
          <View>
            <Typography>{data.bank_account.bank_name}</Typography>
            <Padding height={8} />
            <Typography>{data.bank_account.account_number}</Typography>
            <Padding height={8} />
            <Typography>IFSC: {data.bank_account.ifsc_code}</Typography>
          </View>
        </FlexRow>
      </CustomCard>

      <Padding height={16} />
      <Button
        variant="outline"
        title="Check Details"
        typographyProps={{ size: "1" }}
        onPress={() => handleSelectMandate(data.id, "details")}
      />

      {authDetail.userType === "investor" && data.status === "INVESTOR_AUTH_AWAITED" && data.type === "ENACH" ? (
        <>
          <Padding height={8} />
          <Button
            variant="outline"
            color="success"
            title="Approval Link"
            typographyProps={{ size: "1" }}
            onPress={() => handleSelectMandate(data.id, "link")}
          />
        </>
      ) : null}
    </CustomCard>
  );
}

export default React.memo(MandateRow);
