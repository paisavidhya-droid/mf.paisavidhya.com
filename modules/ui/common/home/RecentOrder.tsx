import React, { useCallback, useContext } from "react";
import { ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext, useGetAllOrdersListQuery } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import Button from "../../Button";
import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import RecentOrderRow from "./RecentOrderRow";

function RecentOrder() {
  const { navigator, params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);

  const authDetail = useSelector((state: RootStateType) => state.auth);

  const {
    data: ordersData = { list: [], total: 0, limit: 3, page: 1 },
    isLoading: isGettingOrders,
    isFetching: isFetchingOrders,
  } = useGetAllOrdersListQuery(
    {
      page: 1,
      limit: 3,
      investorId: authDetail.userType === "partner" ? params?.investorId : undefined,
    },
    {
      skip: !authDetail.id || (authDetail.userType === "partner" && !params?.investorId),
    }
  );

  const handleSeeMoreClick = useCallback(() => {
    if (authDetail.userType === "investor") navigator.navigate("home", "order");
    else navigator.navigate("home", "user", { ...params, userTab: "5" });
  }, [navigator, authDetail.userType, params]);

  const handleNewTransactionClick = useCallback(() => {
    if (authDetail.userType === "investor") navigator.navigate("home", "mutual-funds");
    else navigator.navigate("home", "user", { ...params, userTab: "9" });
  }, [navigator, authDetail.userType, params]);

  return (
    <CustomCard style={{ flexGrow: 1 }}>
      <FlexRow justifyContent="space-between" alignItems="center">
        <Typography size="5" weight="medium">
          Orders
        </Typography>
        <Button variant="outline" title="View All" onPress={handleSeeMoreClick} />
      </FlexRow>
      <Padding height={24} />

      {isGettingOrders || (authDetail.userType === "partner" && isFetchingOrders) ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {!isGettingOrders && !(authDetail.userType === "partner" && isFetchingOrders) && ordersData.total === 0 ? (
        <FlexRow
          justifyContent="center"
          alignItems="center"
          style={{ flexDirection: "column", flexGrow: 1, minHeight: 120 }}
          rowGap={16}
        >
          <Typography color={themeColor.gray[11]} align="center">
            No recent orders made!
          </Typography>
          <Button variant="soft" title="New Transaction" onPress={handleNewTransactionClick} />
        </FlexRow>
      ) : null}

      {ordersData.list.map((val: any, index: number) => (
        <RecentOrderRow data={val} key={index} />
      ))}
    </CustomCard>
  );
}

export default React.memo(RecentOrder);
