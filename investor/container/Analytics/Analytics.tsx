import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

import { ThemeContext } from "@niveshstar/context";
import { Button, Column, ColumnsType, CustomCard, Divider, FlexRow, Padding, Table, Typography } from "@niveshstar/ui";
import { convertToCurrencyWithWords } from "@niveshstar/utils";

import analyticsData from "./data/analytics.json";
import portfolioData from "./data/porfolio.json";

const portfolioTableData = portfolioData.results.map((val) => ({ ...val, ...val.product }));

const initialColumns: ColumnsType[] = [
  { key: "name", name: "Name", width: 300, rupee: false, sortable: false },
  { key: "category", name: "Category", width: 300, rupee: false, sortable: false },
  { key: "amount", name: "Amount", width: 120, rupee: true, sortable: false },
];

const creditRatingOption: Highcharts.Options = {
  chart: {
    width: 300,
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
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
  series: [
    {
      type: "pie",
      showInLegend: true,
      name: "Credit Rating",
      data: Object.keys(analyticsData.rating_allocation).map((key) => ({
        name: key,
        y: Math.floor(analyticsData.rating_allocation[key] * 100) / 100,
      })),
    },
  ],
};

const topFiveSecurityOptions: Highcharts.Options = {
  chart: {
    width: 500,
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  xAxis: {
    categories: Object.keys(analyticsData.top5_debt_instruments).map((key) =>
      key.replace(/\(\d{2}\/\d{2}\/\d{4}\)/, "").trim()
    ),
    title: {
      text: null,
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: "",
      align: "high",
    },
    labels: {
      overflow: "justify",
    },
  },
  tooltip: {
    valueSuffix: "%",
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true,
      },
    },
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      type: "bar",
      name: "Secutiry",
      data: Object.keys(analyticsData.top5_debt_instruments).map(
        (key) => Math.floor(analyticsData.top5_debt_instruments[key] * 100) / 100
      ),
    },
  ],
};

const marketCapOptions: Highcharts.Options = {
  chart: {
    width: 400,
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  xAxis: {
    categories: ["Large Cap", "Medium Cap", "Small Cap"],
    crosshair: true,
  },
  yAxis: {
    title: {
      text: null,
    },
    labels: {
      format: "{value}%",
    },
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.y:.1f}%</b>",
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
      grouping: true,
    },
  },
  series: [
    {
      name: "Equity Portfolio",
      type: "column",
      color: "#2ca02c",
      data: [
        analyticsData.market_cap["Large Cap"][0],
        analyticsData.market_cap["Mid Cap"][0],
        analyticsData.market_cap["Small Cap"][0],
      ],
    },
    {
      name: "NSE ETF",
      type: "column",
      color: "#9467bd",
      data: [
        analyticsData.market_cap["Large Cap"][1],
        analyticsData.market_cap["Mid Cap"][1],
        analyticsData.market_cap["Small Cap"][1],
      ],
    },
  ],
};

const topFiveStocksOptions: Highcharts.Options = {
  chart: {
    width: 500,
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  xAxis: {
    categories: Object.keys(analyticsData.top5_stocks),
    title: {
      text: null,
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: "",
      align: "high",
    },
    labels: {
      overflow: "justify",
    },
  },
  tooltip: {
    valueSuffix: "%",
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true,
      },
    },
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      type: "bar",
      name: "Secutiry",
      color: "#2db4d6",
      data: Object.keys(analyticsData.top5_stocks).map((key) => Math.floor(analyticsData.top5_stocks[key] * 100) / 100),
    },
  ],
};

const topFiveSectorKeys = Object.keys(analyticsData.top5_sector);
const topFiveSectorEquity = topFiveSectorKeys.map((key) => analyticsData.top5_sector[key][0]);
const topFiveSectorNse = topFiveSectorKeys.map((key) => analyticsData.top5_sector[key][1]);

const topFiveSectorOptions: Highcharts.Options = {
  chart: {
    // width: '100%'
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  xAxis: {
    categories: topFiveSectorKeys,
    crosshair: true,
  },
  yAxis: {
    title: {
      text: null,
    },
    labels: {
      format: "{value}%",
    },
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.y:.1f}%</b>",
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
      grouping: true,
    },
  },
  series: [
    {
      name: "Equity Portfolio",
      type: "column",
      data: topFiveSectorEquity,
      color: "#0073e6",
    },
    {
      name: "NSE ETF",
      type: "column",
      data: topFiveSectorNse,
      color: "#ff7f0e",
    },
  ],
};

const assetAllocationOptions: Highcharts.Options = {
  chart: {
    width: 300,
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
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
  series: [
    {
      type: "pie",
      showInLegend: true,
      name: "Credit Rating",
      data: Object.keys(analyticsData.asset_allocation).map((key) => ({
        name: key,
        y: Math.floor(analyticsData.asset_allocation[key] * 100) / 100,
      })),
    },
  ],
};

const productAllocationOptions: Highcharts.Options = {
  chart: {
    width: 500,
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  xAxis: {
    categories: Object.keys(analyticsData.product_allocation),
    title: {
      text: null,
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: "",
      align: "high",
    },
    labels: {
      overflow: "justify",
    },
  },
  tooltip: {
    valueSuffix: "%",
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true,
      },
    },
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      type: "bar",
      name: "Secutiry",
      color: "#2db4d6",
      data: Object.keys(analyticsData.product_allocation).map(
        (key) => Math.floor(analyticsData.product_allocation[key] * 100) / 100
      ),
    },
  ],
};

function Analytics() {
  const { themeColor } = useContext(ThemeContext);

  const [currTab, setCurrTab] = useState("overview");

  const handleTabChange = (newTab: string) => () => {
    setCurrTab(newTab);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <CustomCard>
        <Typography size="5" weight="medium">
          Analytics
        </Typography>
        <Padding height={16} />

        <View style={[styles.allocation, { backgroundColor: themeColor.gray[3] }]}>
          <FlexRow justifyContent="space-between" alignItems="center">
            <View style={{ alignItems: "center" }}>
              <Typography size="5" weight="medium">
                {analyticsData.asset_allocation.Equity}%
              </Typography>
              <Typography weight="medium">Equity</Typography>
            </View>
            <View style={{ alignItems: "center" }}>
              <Typography size="5" weight="medium">
                {analyticsData.asset_allocation.Debt}%
              </Typography>
              <Typography weight="medium">Debt</Typography>
            </View>
            <View style={{ alignItems: "center" }}>
              <Typography size="5" weight="medium">
                {analyticsData.asset_allocation.Alternate}%
              </Typography>
              <Typography weight="medium">Alternate</Typography>
            </View>
            <View style={{ alignItems: "center" }}>
              <Typography size="5" weight="medium">
                ₹{convertToCurrencyWithWords(analyticsData.portfolio_value)}
              </Typography>
              <Typography weight="medium">Total</Typography>
            </View>
            <View style={{ alignItems: "center" }}>
              <Typography size="5" weight="medium" color={themeColor.green[9]}>
                100%
              </Typography>
              <Typography weight="medium">Total</Typography>
            </View>
          </FlexRow>
        </View>

        <Padding height={16} />

        <Table id="id" flexKey="name" data={portfolioTableData} initialColumns={initialColumns} />

        <Padding height={16} />
        <Divider />
        <Padding height={16} />

        <FlexRow>
          <Button
            title="Overview"
            onPress={handleTabChange("overview")}
            variant={currTab === "overview" ? "soft" : "outline"}
          />
          <Padding width={8} />
          <Button
            title="Equity"
            onPress={handleTabChange("equity")}
            variant={currTab === "equity" ? "soft" : "outline"}
          />
          <Padding width={8} />
          <Button title="Debt" onPress={handleTabChange("debt")} variant={currTab === "debt" ? "soft" : "outline"} />
        </FlexRow>

        <Padding height={20} />

        {currTab === "overview" ? (
          <>
            <FlexRow offset={8}>
              <Column col={12} offset={8}>
                <View style={{ alignItems: "center" }}>
                  <Typography size="4" weight="medium">
                    Asset Allocation
                  </Typography>
                  <Padding height={8} />
                  <HighchartsReact highcharts={Highcharts} options={assetAllocationOptions} />
                </View>
              </Column>
              <Column col={12} offset={8}>
                <View style={{ alignItems: "center" }}>
                  <Typography size="4" weight="medium">
                    Product Allocation
                  </Typography>
                  <Padding height={8} />
                  <HighchartsReact highcharts={Highcharts} options={productAllocationOptions} />
                </View>
              </Column>
            </FlexRow>
          </>
        ) : null}

        {currTab === "debt" ? (
          <>
            <Typography size="4" weight="medium">
              Debt Quants
            </Typography>
            <Padding height={8} />

            <View style={[styles.allocation, { backgroundColor: themeColor.gray[3] }]}>
              <FlexRow alignItems="center" justifyContent="space-around">
                <View style={{ alignItems: "center" }}>
                  <Typography size="5" weight="medium">
                    {Math.floor(analyticsData.debt_quants.gross_ytm * 100) / 100}%
                  </Typography>
                  <Typography weight="medium">Gross YTM</Typography>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Typography size="5" weight="medium">
                    {Math.floor(analyticsData.debt_quants.duration * 100) / 100}%
                  </Typography>
                  <Typography weight="medium">Duration</Typography>
                </View>
              </FlexRow>
            </View>

            <Padding height={16} />

            <FlexRow offset={8}>
              <Column col={12} offset={8}>
                <View style={{ alignItems: "center" }}>
                  <Typography size="4" weight="medium">
                    Credit Rating
                  </Typography>
                  <Padding height={8} />
                  <HighchartsReact highcharts={Highcharts} options={creditRatingOption} />
                </View>
              </Column>
              <Column col={12} offset={8}>
                <View style={{ alignItems: "center" }}>
                  <Typography size="4" weight="medium">
                    Top 5 securities
                  </Typography>
                  <Padding height={8} />
                  <HighchartsReact highcharts={Highcharts} options={topFiveSecurityOptions} />
                </View>
              </Column>
            </FlexRow>
          </>
        ) : null}

        {currTab === "equity" ? (
          <>
            <FlexRow offset={8}>
              <Column col={12} offset={8}>
                <View style={{ alignItems: "center" }}>
                  <Typography size="4" weight="medium">
                    Market Cap
                  </Typography>
                  <Padding height={8} />
                  <HighchartsReact highcharts={Highcharts} options={marketCapOptions} />
                </View>
              </Column>
              <Column col={12} offset={8}>
                <View style={{ alignItems: "center" }}>
                  <Typography size="4" weight="medium">
                    Top 5 Stocks
                  </Typography>
                  <Padding height={8} />
                  <HighchartsReact highcharts={Highcharts} options={topFiveStocksOptions} />
                </View>
              </Column>
            </FlexRow>

            <Padding height={16} />

            <Typography size="4" weight="medium">
              Top 5 Sector
            </Typography>
            <Padding height={8} />
            <HighchartsReact highcharts={Highcharts} options={topFiveSectorOptions} />
          </>
        ) : null}
      </CustomCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
  allocation: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  link: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
});

export default React.memo(Analytics);
