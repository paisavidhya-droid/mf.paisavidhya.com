import React, { useContext } from "react";
import { useSelector } from "react-redux";

import { RootStateType, ScreenContext, useGetHoldingsQuery } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import Column from "../../Column";
import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import HoldingsTable from "./HoldingsTable";
import Overview from "./Overview";
import RecentOrder from "./RecentOrder";

function InvestorPortfolio() {
  const { params } = useNavigation();
  const { screenType } = useContext(ScreenContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const { data, isLoading, isFetching } = useGetHoldingsQuery(
    authDetail.userType === "partner" ? params?.investorId : undefined,
    {
      skip: !authDetail.id,
    }
  );

  const columnSize = screenType === "sm" ? 24 : screenType === "md" ? 12 : 8;

  return (
    <>
      <FlexRow offset={8} alignItems="stretch" rowGap={16} wrap>
        <Column col={columnSize} offset={8}>
          <Overview data={data} isLoading={authDetail.userType === "investor" ? isLoading : isFetching} />
        </Column>
        <Column col={columnSize} offset={8}>
          <RecentOrder />
        </Column>
      </FlexRow>

      <Padding height={16} />

      <CustomCard style={{ flexGrow: 1 }}>
        <HoldingsTable
          data={data?.holdings ?? []}
          isLoading={authDetail.userType === "investor" ? isLoading : isFetching}
        />
      </CustomCard>
    </>
  );
}

export default React.memo(InvestorPortfolio);
