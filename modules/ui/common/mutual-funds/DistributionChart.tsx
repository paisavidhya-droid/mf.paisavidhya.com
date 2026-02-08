import React, { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

import { graphColors } from "@niveshstar/constant";
import { ScreenContext, ThemeContext } from "@niveshstar/context";

import Column from "../../Column";
import FlexRow from "../../FlexRow";

interface PropsType {
  data: any;
}

function DistributionChart(props: PropsType) {
  const { data } = props;
  const { screenType } = useContext(ScreenContext);
  const { themeColor } = useContext(ThemeContext);

  const [chartOption, setChartOption] = useState({
    fundDistributionOption: {},
    sectorDistributionOption: {},
  });

  const processPortfolio = useCallback(() => {
    const equity = [];
    const other = [];
    const sectorsDist = new Map();
    let percentEquity = 0;
    let percentOther = 0;

    const portfolioData = data.portfolio_data || [];

    for (const val of portfolioData) {
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

    const fundDistributionOption: Highcharts.Options = {
      chart: {
        width: 360,
        height: 300,
        backgroundColor: "transparent",
      },
      title: {
        text: "",
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          innerSize: "80%",
          borderRadius: 100,
          dataLabels: {
            enabled: false,
            format: "{point.name}: {point.y}%",
          },
        },
      },
      tooltip: {
        format: "{point.name}: {point.y}%",
        valueDecimals: 2,
      },
      legend: {
        itemStyle: {
          color: themeColor.gray[12],
        },
      },
      series: [
        {
          showInLegend: true,
          name: "Percentage",
          type: "pie",
          data: [
            {
              y: Math.round(percentEquity * 100) / 100,
              color: graphColors[0],
              name: "Equity",
            },
            {
              y: Math.round(percentOther * 100) / 100,
              color: graphColors[1],
              name: "Debt & Cash",
            },
          ],
        },
      ],
    };

    const sectorData = Array.from(sectorsDist).map(([name, percent], index) => ({
      name,
      y: Math.round(percent * 100) / 100,
      color: graphColors[index % graphColors.length],
    }));

    const sectorDistributionOption: Highcharts.Options = {
      chart: {
        width: 360,
        height: 300,
        backgroundColor: "transparent",
      },
      title: {
        text: "",
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          innerSize: "80%",
          borderRadius: 100,
          dataLabels: {
            enabled: false,
            format: "{point.name}: {point.y}%",
          },
        },
      },
      legend: {
        itemStyle: {
          color: themeColor.gray[12],
        },
      },
      tooltip: {
        format: "{point.name}: {point.y}%",
        valueDecimals: 2,
      },
      series: [
        {
          showInLegend: true,
          name: "Sector Distribution",
          type: "pie",
          data: sectorData,
        },
      ],
    };

    setChartOption({ fundDistributionOption, sectorDistributionOption });
  }, [data, themeColor]);

  useEffect(() => {
    processPortfolio();
  }, [processPortfolio]);

  return (
    <FlexRow offset={8} rowGap={16} wrap>
      <Column col={screenType === "sm" ? 24 : 12} offset={8}>
        <View style={{ alignItems: "center" }}>
          <HighchartsReact highcharts={Highcharts} options={chartOption.fundDistributionOption} />
        </View>
      </Column>
      <Column col={screenType === "sm" ? 24 : 12} offset={8}>
        <View style={{ alignItems: "center" }}>
          <HighchartsReact highcharts={Highcharts} options={chartOption.sectorDistributionOption} />
        </View>
      </Column>
    </FlexRow>
  );
}

export default React.memo(DistributionChart);
