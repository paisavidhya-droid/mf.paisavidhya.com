import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, View } from "react-native";
// import Entypo from "@expo/vector-icons/Entypo";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { convertCurrencyToString } from "@niveshstar/utils";

import Button from "../../Button";
import CustomCard from "../../CustomCard";
import Divider from "../../Divider";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import ImportViaOtpModal from "./ImportViaOtpModal";

interface PropsType {
  data: any;
  isLoading: boolean;
}

function Overview(props: PropsType) {
  const { data, isLoading } = props;

  const { navigator, params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  // const [currTab, setCurrTab] = useState<HoldingsSourceType>("combined");

  // const openOtpModal = useCallback(() => {
  //   setIsOtpModalOpen(true);
  // }, []);

  const closeOtpModal = useCallback(() => {
    setIsOtpModalOpen(false);
  }, []);

  const authDetail = useSelector((state: RootStateType) => state.auth);

  // const handleChanegTab = useCallback(
  //   (tab: HoldingsSourceType) => () => {
  //     setCurrTab(tab);
  //   },
  //   []
  // );

  const handleNewTransactionClick = () => {
    if (authDetail.userType === "investor") navigator.navigate("home", "mutual-funds");
    else navigator.navigate("home", "user", { ...params, userTab: "9" });
  };

  // const selectedTabData = useMemo(() => {
  //   if (!data) return null;
  //   else return data[currTab];
  // }, [currTab, data]);

  return (
    <CustomCard style={{ flexGrow: 1 }}>
      <FlexRow alignItems="center" justifyContent="space-between">
        <Typography size="5" weight="medium">
          Portfolio
        </Typography>
        {/* <Button
          variant="outline"
          onPress={openOtpModal}
          icon={<Entypo name="cycle" size={16} color={themeColor.accent[9]} />}
        /> */}
      </FlexRow>
      <Padding height={24} />
      {isLoading ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {!isLoading && !data ? (
        <>
          <FlexRow
            justifyContent="center"
            alignItems="center"
            style={{ flexGrow: 1, flexDirection: "column", minHeight: 120 }}
          >
            <Typography align="center">Help {authDetail.firstName} kickstart their investment journey</Typography>
            <Padding height={16} />
            <FlexRow justifyContent="center">
              <Button variant="soft" title="New Transaction" onPress={handleNewTransactionClick} />
            </FlexRow>
          </FlexRow>
        </>
      ) : null}

      {!isLoading && data ? (
        <>
          {/* <FlexRow colGap={8}>
            <Button
              title="All"
              style={{ paddingVertical: 4 }}
              typographyProps={{ size: "1" }}
              onPress={handleChanegTab("combined")}
              variant={currTab === "combined" ? "soft" : "outline"}
            />

            <Button
              title="Inside"
              style={{ paddingVertical: 4 }}
              typographyProps={{ size: "1" }}
              onPress={handleChanegTab("internal")}
              variant={currTab === "internal" ? "soft" : "outline"}
            />

            <Button
              title="Outside"
              style={{ paddingVertical: 4 }}
              typographyProps={{ size: "1" }}
              onPress={handleChanegTab("external")}
              variant={currTab === "external" ? "soft" : "outline"}
            />
          </FlexRow> */}

          <Padding height={24} />

          <FlexRow justifyContent="space-between">
            <View>
              <Typography color={themeColor.gray[11]}>Current</Typography>
              <Padding height={8} />
              <Typography>{convertCurrencyToString(data?.current_value || 0)}</Typography>
            </View>
            <View>
              <Typography color={themeColor.gray[11]} align="right">
                Total returns
              </Typography>
              <Padding height={8} />
              <Typography color={data?.absolute_gain >= 0 ? themeColor.green[9] : themeColor.red[9]} align="right">
                {convertCurrencyToString(data?.absolute_gain || 0)}
              </Typography>
            </View>
          </FlexRow>

          <Padding height={8} />
          <Divider />
          <Padding height={8} />

          <FlexRow justifyContent="space-between">
            <View>
              <Typography color={themeColor.gray[11]}>Invested</Typography>
              <Padding height={8} />
              <Typography>{convertCurrencyToString(data?.total_investment_amount || 0)}</Typography>
            </View>
            <View>
              <Typography color={themeColor.gray[11]} align="right">
                Gain
              </Typography>
              <Padding height={8} />
              <Typography color={data?.absolute_gain >= 0 ? themeColor.green[9] : themeColor.red[9]} align="right">
                {data?.absolute_return_percent || 0}%
              </Typography>
            </View>
          </FlexRow>

          <Padding height={8} />
          <Divider />
          <Padding height={8} />

          <FlexRow justifyContent="space-between">
            <Typography color={themeColor.gray[11]}>XIRR</Typography>
            <Typography color={data?.xirr >= 0 ? themeColor.green[9] : themeColor.red[9]} align="right">
              {data?.xirr || 0}%
            </Typography>
          </FlexRow>
        </>
      ) : null}

      <ImportViaOtpModal isModalVisible={isOtpModalOpen} closeModal={closeOtpModal} />
    </CustomCard>
  );
}

export default React.memo(Overview);
