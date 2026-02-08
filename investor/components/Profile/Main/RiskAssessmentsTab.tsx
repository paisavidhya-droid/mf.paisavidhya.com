import React from "react";
import { useSelector } from "react-redux";

import { RootStateType } from "@niveshstar/context";
import { CustomCard, EmptyResult, InvestorRiskProfiling, Padding, Typography } from "@niveshstar/ui";

function RiskAssessmentsTab() {
  const authDetail = useSelector((state: RootStateType) => state.auth);
  const investorId = authDetail?.id ? String(authDetail.id) : null;

  if (!investorId) {
    return (
      <CustomCard>
        <Typography size="5" weight="medium">
          Risk Assessments
        </Typography>
        <Padding height={12} />
        <EmptyResult title="Unable to load investor context." style={{ minHeight: 140 }} />
      </CustomCard>
    );
  }

  return <InvestorRiskProfiling investorId={investorId} includeInvestorParam={false} />;
}

export default React.memo(RiskAssessmentsTab);
