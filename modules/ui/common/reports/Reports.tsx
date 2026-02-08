import React from "react";
import { useSelector } from "react-redux";

import { RootStateType } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import CustomCard from "../../CustomCard";

function Reports() {
  const { params } = useNavigation();
  const authDetail = useSelector((state: RootStateType) => state.auth);

  return (
    <CustomCard style={{ flexGrow: 1 }}>
      <iframe
        src={`${process.env.EXPO_PUBLIC_INVESTOR_STATS_REPORT_URL}/investor/${params.investorId}?token=${authDetail.accessToken}`}
        style={{
          border: 0,
          outline: 0,
          flex: 1,
        }}
      />
    </CustomCard>
  );
}

export default React.memo(Reports);
