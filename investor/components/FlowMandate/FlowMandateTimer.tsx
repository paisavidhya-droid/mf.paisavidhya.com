import React from "react";

import { Padding, Typography } from "@niveshstar/ui";
import { getTimeLeftString } from "@niveshstar/utils";

interface PropsType {
  timeLeft: number;
}

export default function FlowMandateTimer(props: PropsType) {
  const { timeLeft } = props;
  return (
    <>
      <Typography align="center">Please complete the payment in the given time frame</Typography>
      <Padding height={16} />
      <Typography align="center" size="3" weight="medium">
        Time remaining: {getTimeLeftString(timeLeft)}
      </Typography>
    </>
  );
}
