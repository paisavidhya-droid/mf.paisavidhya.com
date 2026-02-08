import React from "react";

import { BseDetails, CustomCard } from "@niveshstar/ui";

interface PropsType {
  investorProfile: any;
}

function BseTab(props: PropsType) {
  const { investorProfile } = props;

  return (
    <CustomCard>
      <BseDetails investorProfile={investorProfile} />
    </CustomCard>
  );
}

export default React.memo(BseTab);
