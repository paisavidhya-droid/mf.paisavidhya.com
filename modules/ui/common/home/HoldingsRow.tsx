import React, { useContext } from "react";

import { ThemeContext } from "@niveshstar/context";
import { convertCurrencyToString } from "@niveshstar/utils";

import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import HoldingsMenu from "./HoldingsMenu";

interface PropsType {
  data: any;
  index: number;
  selectScheme: (index: number, purpose: "TRANSACTION" | "LUMPSUM" | "REDEEM") => void;
}

function HoldingsRow(props: PropsType) {
  const { data, selectScheme, index } = props;
  const { themeColor } = useContext(ThemeContext);

  return (
    <CustomCard style={{ flexGrow: 1, backgroundColor: themeColor.gray[3] }}>
      <FlexRow>
        <Typography weight="medium" size="2" style={{ flex: 1 }}>
          {data.scheme_name}
        </Typography>
        <Padding width={16} />
        <HoldingsMenu selectScheme={selectScheme} index={index} />
      </FlexRow>
      <Padding height={24} />
      <FlexRow>
        <Typography style={{ flex: 1 }}>Invested</Typography>
        <Padding width={16} />
        <Typography align="right" weight="medium">
          {convertCurrencyToString(data.total_investment_amount)}
        </Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography style={{ flex: 1 }}>Current</Typography>
        <Padding width={16} />
        <Typography
          align="right"
          weight="medium"
          color={data.current_value >= data.total_investment_amount ? themeColor.green[9] : themeColor.red[9]}
        >
          {convertCurrencyToString(data.current_value)}
        </Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography style={{ flex: 1 }}>Units</Typography>
        <Padding width={16} />
        <Typography align="right" weight="medium">
          {Math.floor(data.total_units * 100) / 100}
        </Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow justifyContent="space-between">
        <Typography style={{ flex: 1 }}>XIRR</Typography>
        <Padding width={16} />
        <Typography color={data.xirr >= 0 ? themeColor.green[9] : themeColor.red[9]}>{data.xirr}</Typography>
      </FlexRow>
    </CustomCard>
  );
}

export default React.memo(HoldingsRow);
