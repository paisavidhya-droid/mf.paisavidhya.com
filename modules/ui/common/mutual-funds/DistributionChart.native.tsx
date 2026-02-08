import React, { useCallback, useEffect, useState } from "react";

import Column from "../../Column";
import DonutChart from "../../DonutChart";
import Padding from "../../Padding";

interface PropsType {
  data: any;
}

function DistributionChart(props: PropsType) {
  const { data } = props;
  const [chartOption, setChartOption] = useState({
    fundDistribution: [],
    sectorDistribution: [],
  });

  const processPortfolio = useCallback(() => {
    const equity = [];
    const other = [];
    const sectorsDist = new Map();
    let percentEquity = 0;
    let percentOther = 0;

    const portfolioData = data.portfolio_data || [];

    for (let val of portfolioData) {
      sectorsDist.set(val.index, val.perc);

      if (val.type === "Equity") {
        equity.push(val);
        percentEquity += val.perc;
      } else {
        other.push(val);
        percentOther += val.perc;
      }
    }

    equity.sort((a, b) => b.perc - a.perc);
    other.sort((a, b) => b.perc - a.perc);

    const fundDistribution = [
      { value: Math.round(percentEquity * 100) / 100, label: "Equiy" },
      { value: Math.round(percentOther * 100) / 100, label: "Debt & Cash" },
    ];

    const sectorDistribution = Array.from(sectorsDist).map(([name, percent], index) => ({
      label: name,
      value: Math.round(percent * 100) / 100,
    }));

    setChartOption({ fundDistribution, sectorDistribution });
  }, [data]);

  useEffect(() => {
    processPortfolio();
  }, [data]);

  return (
    <>
      <Column col={6} offset={10}>
        <DonutChart data={chartOption.fundDistribution} outerStrokeWidth={40} strokeWidth={30} radius={140} />
      </Column>
      <Padding height={20} />
      <Column col={6} offset={10}>
        <DonutChart data={chartOption.sectorDistribution} outerStrokeWidth={40} strokeWidth={30} radius={140} />
      </Column>
    </>
  );
}

export default React.memo(DistributionChart);
