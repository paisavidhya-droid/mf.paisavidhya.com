import React, { useCallback, useContext, useMemo, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext } from "@niveshstar/context";
import { convertCurrencyToString } from "@niveshstar/utils";

import Button from "../../Button";
import Column from "../../Column";
import CustomCard from "../../CustomCard";
import Divider from "../../Divider";
import Embeddings from "../../Embeddings";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import InvestForm from "../home/InvestForm";

interface PropsType {
  data: any;
}

type KeyValueItem = {
  label: string;
  value: React.ReactNode;
  helperText?: string;
};

type HoldingsColumn<T> = {
  header: string;
  render: (row: T, rowIndex: number) => string;
  style?: any;
  weight?: React.ComponentProps<typeof Typography>["weight"];
  numberOfLines?: number;
};

type HoldingsSectionConfig<T> = {
  title: string;
  subtitle?: string;
  holdings: T[];
  columns: HoldingsColumn<T>[];
  showAll: boolean;
  toggleShowAll: () => void;
  emptyMessage: string;
};

const isNumber = (value: unknown): value is number => typeof value === "number" && !Number.isNaN(value);

const formatPercent = (value?: number | null, digits = 2): string => {
  if (!isNumber(value)) return "N/A";
  return `${value.toFixed(digits)}%`;
};

const formatLargeNumber = (value?: number | null): string => {
  if (!isNumber(value)) return "N/A";
  return convertCurrencyToString(value);
};

const formatPlainNumber = (value?: number | null, digits = 2): string => {
  if (!isNumber(value)) return "N/A";
  return value.toFixed(digits);
};

const formatMarketValue = (value?: number | null): string => {
  if (!isNumber(value)) return "N/A";

  const croreValue = value / 1e7;
  return `${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: croreValue >= 100 ? 0 : croreValue >= 10 ? 1 : 2,
    maximumFractionDigits: 2,
  }).format(croreValue)} Cr`;
};

const sortHoldingsByWeight = <T extends { portfolio_weight?: number | null }>(holdings: T[]): T[] =>
  [...holdings].sort((a, b) => {
    const weightA = isNumber(a?.portfolio_weight) ? (a.portfolio_weight as number) : 0;
    const weightB = isNumber(b?.portfolio_weight) ? (b.portfolio_weight as number) : 0;
    return weightB - weightA;
  });

const prettifyLabel = (label: string): string =>
  label
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatGenericValue = (value: any): string => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "number") {
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") {
    if (/\d{4}-\d{2}-\d{2}T/.test(value) && moment(value).isValid()) {
      return moment(value).format("D MMM YYYY");
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "N/A";
  }
  return JSON.stringify(value);
};

const recordToItems = (record?: Record<string, any> | null): KeyValueItem[] =>
  Object.entries(record || {}).map(([key, value]) => ({
    label: prettifyLabel(key),
    value: formatGenericValue(value),
  }));

function SchemeDetails(props: PropsType) {
  const { data } = props;
  const { themeColor } = useContext(ThemeContext);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [showAllBondHoldings, setShowAllBondHoldings] = useState(false);
  const [showAllOtherHoldings, setShowAllOtherHoldings] = useState(false);
  const [showAllEquityHoldings, setShowAllEquityHoldings] = useState(false);

  const authDetail = useSelector((state: RootStateType) => state.auth);
  const schemeMfData = data?.mf_data ?? null;

  const openInvestModal = useCallback(() => {
    setIsInvestModalOpen(true);
  }, []);

  const closeInvestModal = useCallback(() => {
    setIsInvestModalOpen(false);
  }, []);

  const schemeInfo = schemeMfData?.scheme?.[0];
  const schemeReturns = schemeMfData?.returns || [];
  const assetAllocation = schemeMfData?.asset_allocation || [];
  const managementTeam = schemeMfData?.management_team || [];
  const equityHoldings = schemeMfData?.equity_holdings || [];
  const bondHoldings = schemeMfData?.bond_holdings || [];
  const otherHoldings = schemeMfData?.other_holdings || [];
  const marketVolatility = schemeMfData?.market_volatility || [];
  const riskVolatility = schemeMfData?.risk_volatility || [];
  const marketCapBreakdown = schemeMfData?.market_cap || [];
  const styleMeasures = schemeMfData?.style_measures || [];
  const fundAnalysis = schemeMfData?.fund_analysis || [];

  const sortedEquityHoldings = useMemo(() => sortHoldingsByWeight(equityHoldings), [equityHoldings]);
  const sortedBondHoldings = useMemo(() => sortHoldingsByWeight(bondHoldings), [bondHoldings]);
  const sortedOtherHoldings = useMemo(() => sortHoldingsByWeight(otherHoldings), [otherHoldings]);

  const holdingsRowLimit = 5;

  const renderHoldingsSection = <T extends { id?: string | number }>(config: HoldingsSectionConfig<T>) => {
    const { title, subtitle, holdings, columns, showAll, toggleShowAll, emptyMessage } = config;
    const shouldShowToggle = holdings.length > holdingsRowLimit;
    const rowsToRender = showAll ? holdings : holdings.slice(0, holdingsRowLimit);

    return (
      <>
        <View>
          <Typography size="4" weight="bold">
            {title}
          </Typography>
          {subtitle ? (
            <>
              <Padding height={4} />
              <Typography size="2" color={themeColor.gray[11]}>
                {subtitle}
              </Typography>
            </>
          ) : null}
        </View>
        <Padding height={12} />
        <CustomCard>
          {holdings.length ? (
            <>
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                {columns.map((column) => (
                  <Typography
                    key={`${title}-header-${column.header}`}
                    size="2"
                    weight="medium"
                    style={[styles.tableCell, column.style]}
                  >
                    {column.header}
                  </Typography>
                ))}
              </View>
              {rowsToRender.map((row, rowIndex) => (
                <View key={`${title}-row-${(row as any).id ?? rowIndex}`} style={styles.tableRow}>
                  {columns.map((column) => (
                    <Typography
                      key={`${title}-cell-${column.header}-${(row as any).id ?? rowIndex}`}
                      size="2"
                      weight={column.weight ?? "regular"}
                      style={[styles.tableCell, column.style]}
                      numberOfLines={column.numberOfLines ?? 2}
                    >
                      {column.render(row, rowIndex)}
                    </Typography>
                  ))}
                </View>
              ))}
              {shouldShowToggle ? (
                <FlexRow justifyContent="center" style={{ marginTop: 12 }}>
                  <Button
                    variant="soft"
                    title={showAll ? "Show Less" : `Show All (${holdings.length})`}
                    onPress={toggleShowAll}
                  />
                </FlexRow>
              ) : null}
            </>
          ) : (
            <Typography size="2" color={themeColor.gray[11]} align="center" style={{ paddingVertical: 12 }}>
              {emptyMessage}
            </Typography>
          )}
        </CustomCard>
      </>
    );
  };

  const equitySubtitle = equityHoldings.length
    ? `Top ${Math.min(holdingsRowLimit, equityHoldings.length)} of ${equityHoldings.length} disclosed positions`
    : undefined;

  const bondSubtitle = bondHoldings.length
    ? `Top ${Math.min(holdingsRowLimit, bondHoldings.length)} of ${bondHoldings.length} instruments`
    : undefined;

  const otherSubtitle = otherHoldings.length
    ? `Top ${Math.min(holdingsRowLimit, otherHoldings.length)} of ${otherHoldings.length} other assets`
    : undefined;

  const equityColumns: HoldingsColumn<any>[] = [
    { header: "#", render: (_row, index) => `${index + 1}`, style: styles.cellRank, weight: "medium" },
    {
      header: "Company",
      render: (row) => row.holding_name || "N/A",
      style: styles.cellLarge,
      weight: "medium",
      numberOfLines: 2,
    },
    {
      header: "Sector",
      render: (row) => row.sector || "N/A",
      style: styles.cellMedium,
      numberOfLines: 2,
    },
    {
      header: "Weight",
      render: (row) => formatPercent(row.portfolio_weight),
      style: styles.cellSmall,
    },
    {
      header: "1Y Return",
      render: (row) => formatPercent(row.one_year_return),
      style: styles.cellSmall,
    },
    {
      header: "Market Value",
      render: (row) => formatMarketValue(row.market_value),
      style: styles.cellMedium,
    },
  ];

  const bondColumns: HoldingsColumn<any>[] = [
    { header: "#", render: (_row, index) => `${index + 1}`, style: styles.cellRank, weight: "medium" },
    {
      header: "Instrument",
      render: (row) => row.bond_name || row.holding_name || "N/A",
      style: styles.cellLarge,
      weight: "medium",
      numberOfLines: 2,
    },
    {
      header: "Type",
      render: (row) => (row.sector ? prettifyLabel(row.sector) : "N/A"),
      style: styles.cellSmall,
    },
    {
      header: "Weight",
      render: (row) => formatPercent(row.portfolio_weight),
      style: styles.cellSmall,
    },
    {
      header: "Coupon",
      render: (row) => formatPercent(row.coupon_rate),
      style: styles.cellSmall,
    },
    {
      header: "Maturity",
      render: (row) => (row.maturity_date ? moment(row.maturity_date).format("D MMM YYYY") : "N/A"),
      style: styles.cellMedium,
    },
  ];

  const otherColumns: HoldingsColumn<any>[] = [
    { header: "#", render: (_row, index) => `${index + 1}`, style: styles.cellRank, weight: "medium" },
    {
      header: "Holding",
      render: (row) => row.holding_name || row.bond_name || "N/A",
      style: styles.cellLarge,
      weight: "medium",
      numberOfLines: 2,
    },
    {
      header: "Weight",
      render: (row) => formatPercent(row.portfolio_weight),
      style: styles.cellSmall,
    },
    {
      header: "Market Value",
      render: (row) => formatMarketValue(row.market_value),
      style: styles.cellMedium,
    },
  ];

  const renderKeyValueGrid = (items: KeyValueItem[], colSpan = 12) => {
    if (!items.length) return null;

    return (
      <FlexRow offset={16} rowGap={12} wrap>
        {items.map((item, idx) => (
          <Column col={colSpan} offset={16} key={`${item.label}-${idx}`}>
            <View style={styles.keyValueRow}>
              <Typography size="2" color={themeColor.gray[11]}>
                {item.label}
              </Typography>
              <Typography size="2" weight="medium" style={styles.keyValueText}>
                {item.value ?? "N/A"}
              </Typography>
            </View>
            {item.helperText ? (
              <Typography size="1" color={themeColor.gray[11]} style={styles.helperText}>
                {item.helperText}
              </Typography>
            ) : null}
          </Column>
        ))}
      </FlexRow>
    );
  };

  const renderNarrativeBlock = (
    fallbackTitle: string,
    block?: { title?: string | null; content?: string | null; publishDate?: string | null }
  ) => {
    if (!block?.title && !block?.content) return null;

    return (
      <View style={styles.narrativeBlock}>
        <Typography size="3" weight="bold">
          {block.title || fallbackTitle}
        </Typography>
        {block.content ? (
          <>
            <Padding height={4} />
            <Typography size="2" color={themeColor.gray[11]}>
              {block.content}
            </Typography>
          </>
        ) : null}
        {block.publishDate ? (
          <>
            <Padding height={4} />
            <Typography size="1" color={themeColor.gray[10]}>
              Updated {moment(block.publishDate).format("D MMM YYYY, hh:mm A")}
            </Typography>
          </>
        ) : null}
      </View>
    );
  };

  return (
    <>
      <FlexRow alignItems="center" justifyContent="space-between">
        <FlexRow alignItems="center" style={{ flexGrow: 1 }}>
          <Image source={{ uri: data.amc_img_url?.trim() }} style={styles.img} />
          <Padding width={12} />
          <View style={{ flex: 1 }}>
            <Typography size="5" weight="bold" numberOfLines={2}>
              {data.name}
            </Typography>
            <Padding height={4} />
            <Typography size="2" color={themeColor.gray[11]} numberOfLines={1}>
              {data.scheme_amc_name}
            </Typography>
          </View>
        </FlexRow>
        <FlexRow justifyContent="flex-end" alignItems="center">
          <Button title="Invest Now" onPress={openInvestModal} />
        </FlexRow>
      </FlexRow>

      <Padding height={16} />

      <FlexRow alignItems="center" justifyContent="space-between">
        <View>
          <Typography size="1" color={themeColor.gray[11]}>
            Category
          </Typography>
          <Padding height={4} />
          <Typography size="3" weight="medium">
            {data.scheme_sub_category || "—"}
          </Typography>
        </View>
        <View>
          <Typography size="1" color={themeColor.gray[11]}>
            Plan & Option
          </Typography>
          <Padding height={4} />
          <Typography size="3" weight="medium">
            {data.scheme_plan} / {data.scheme_option}
          </Typography>
        </View>
      </FlexRow>

      <Padding height={24} />
      <Divider />
      <Padding height={24} />

      <Embeddings
        url="/embed/stock-chart"
        message={{
          id: data.id,
          accessToken: authDetail.accessToken,
          refreshToken: authDetail.refreshToken,
        }}
        style={{
          minHeight: 300,
          maxHeight: 300,
        }}
      />

      <Padding height={36} />

      <Typography size="5" weight="bold">
        Scheme Details
      </Typography>
      <Padding height={16} />

      <CustomCard>
        <FlexRow offset={16} rowGap={12} wrap>
          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                Min. Investment
              </Typography>
              <Typography size="2" weight="medium">
                {convertCurrencyToString(data.purchase.min_amt)}
              </Typography>
            </FlexRow>
          </Column>

          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                Face Value
              </Typography>
              <Typography size="2" weight="medium">
                ₹{data.scheme_face_value || "-"}
              </Typography>
            </FlexRow>
          </Column>

          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                Lock-in Period
              </Typography>
              <Typography size="2" weight="medium">
                {data.scheme_lockin_period > 0
                  ? `${data.scheme_lockin_period} ${data.scheme_lockin_period_type || "days"}`
                  : "None"}
              </Typography>
            </FlexRow>
          </Column>

          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                Redemption Settlement
              </Typography>
              <Typography size="2" weight="medium">
                {data.scheme_redemption_settlement_days || "-"}
              </Typography>
            </FlexRow>
          </Column>

          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                Offer Status
              </Typography>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: data.scheme_offer_status === "OPEN" ? themeColor.green[3] : themeColor.red[3],
                  },
                ]}
              >
                <Typography
                  size="1"
                  weight="medium"
                  color={data.scheme_offer_status === "OPEN" ? themeColor.green[11] : themeColor.red[11]}
                >
                  {data.scheme_offer_status || "CLOSED"}
                </Typography>
              </View>
            </FlexRow>
          </Column>

          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                Scheme Type
              </Typography>
              <Typography size="2" weight="medium">
                {data.scheme_offer_type || "-"}
              </Typography>
            </FlexRow>
          </Column>

          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                Transaction Mode
              </Typography>
              <Typography size="2" weight="medium">
                {data.physical_allowed && data.demat_allowed
                  ? "Demat & Physical"
                  : data.demat_allowed
                    ? "Demat Only"
                    : data.physical_allowed
                      ? "Physical Only"
                      : "N/A"}
              </Typography>
            </FlexRow>
          </Column>

          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                Exit Load
              </Typography>
              <Typography size="2" weight="medium">
                {data.scheme_exit_load !== "0" ? `${data.scheme_exit_load}%` : "None"}
                {data.scheme_exit_load_remarks ? ` — ${data.scheme_exit_load_remarks}` : ""}
              </Typography>
            </FlexRow>
          </Column>

          {data.nfo_open_date ? (
            <Column col={12} offset={16}>
              <FlexRow alignItems="center" justifyContent="space-between">
                <Typography size="2" color={themeColor.gray[11]}>
                  NFO Open Date
                </Typography>
                <Typography size="2" weight="medium">
                  {moment(data.nfo_open_date).format("D MMMM YYYY")}
                </Typography>
              </FlexRow>
            </Column>
          ) : null}

          {data.nfo_close_date ? (
            <Column col={12} offset={16}>
              <FlexRow alignItems="center" justifyContent="space-between">
                <Typography size="2" color={themeColor.gray[11]}>
                  NFO Open Date
                </Typography>
                <Typography size="2" weight="medium">
                  {moment(data.nfo_close_date).format("D MMMM YYYY")}
                </Typography>
              </FlexRow>
            </Column>
          ) : null}
        </FlexRow>
      </CustomCard>

      <Padding height={36} />

      {data.nfo_payment_details?.length > 0 && (
        <>
          <Typography size="5" weight="bold">
            Payment Modes (NFO)
          </Typography>
          <Padding height={16} />
          <CustomCard>
            <FlexRow offset={12} rowGap={8} wrap>
              {data.nfo_payment_details.map((pm: any, idx: number) => (
                <Column col={6} offset={12} key={idx}>
                  <View style={[styles.statusBadge, { backgroundColor: themeColor.accent[3] }]}>
                    <Typography size="1" weight="medium" color={themeColor.accent[11]} align="center">
                      {pm.nfo_payment_mode_name}
                    </Typography>
                  </View>
                </Column>
              ))}
            </FlexRow>
          </CustomCard>
          <Padding height={36} />
        </>
      )}

      <Typography size="5" weight="bold">
        Fund Identifiers
      </Typography>
      <Padding height={16} />

      <CustomCard>
        <FlexRow offset={16} rowGap={12} wrap>
          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                ISIN
              </Typography>
              <Typography size="2" weight="medium">
                {data.scheme_isin || "—"}
              </Typography>
            </FlexRow>
          </Column>
          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                AMC
              </Typography>
              <Typography size="2" weight="medium">
                {data.scheme_amc_name || "—"}
              </Typography>
            </FlexRow>
          </Column>
          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                RTA
              </Typography>
              <Typography size="2" weight="medium">
                {data.scheme_rta_name || "—"}
              </Typography>
            </FlexRow>
          </Column>
          <Column col={12} offset={16}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <Typography size="2" color={themeColor.gray[11]}>
                BSE Code
              </Typography>
              <Typography size="2" weight="medium">
                {data.scheme_bse_code || "—"}
              </Typography>
            </FlexRow>
          </Column>
        </FlexRow>
      </CustomCard>

      {schemeMfData && (
        <>
          <Padding height={36} />

          <Typography size="5" weight="bold">
            Fund Insights
          </Typography>
          <Padding height={4} />
          <Typography size="2" color={themeColor.gray[11]}>
            Additional metrics sourced from the MF data API
          </Typography>
          <Padding height={16} />

          {schemeInfo ? (
            <CustomCard>
              {renderKeyValueGrid([
                { label: "Fund Name", value: schemeInfo.fund_name },
                { label: "SECID", value: schemeInfo.secid },
                { label: "Rating", value: isNumber(schemeInfo.rating) ? `${schemeInfo.rating}/5` : "N/A" },
                { label: "Total Assets", value: formatLargeNumber(schemeInfo.total_assets) },
                {
                  label: "Inception Date",
                  value: schemeInfo.inception_date ? moment(schemeInfo.inception_date).format("D MMM YYYY") : "N/A",
                },
                { label: "Expense Ratio", value: formatPercent(schemeInfo.expense_ratio) },
                { label: "Fee Level", value: schemeInfo.fee_level || "N/A" },
                { label: "Load", value: schemeInfo.load || "N/A" },
                { label: "Category", value: schemeInfo.category || "N/A" },
                { label: "Investment Style", value: schemeInfo.investment_style || "N/A" },
                { label: "Min Initial Investment", value: formatLargeNumber(schemeInfo.min_initial_investment) },
                { label: "Status", value: schemeInfo.status || "N/A" },
                { label: "TTM Yield", value: formatPercent(schemeInfo.ttm_yield) },
                { label: "Turnover", value: formatPercent(schemeInfo.turnover) },
                { label: "Reported Turnover", value: formatPercent(schemeInfo.reported_turnover) },
                { label: "Managers", value: formatPlainNumber(schemeInfo.num_of_managers, 0) },
                { label: "Longest Tenure (yrs)", value: formatPlainNumber(schemeInfo.longest_tenure) },
                { label: "Average Tenure (yrs)", value: formatPlainNumber(schemeInfo.average_tenure) },
                { label: "Advisor", value: schemeInfo.advisor || "N/A" },
                { label: "Equity Long", value: formatPercent(schemeInfo.equity_long) },
                { label: "Equity Short", value: formatPercent(schemeInfo.equity_short) },
                { label: "Bond Long", value: formatPercent(schemeInfo.bond_long) },
                { label: "Bond Short", value: formatPercent(schemeInfo.bond_short) },
                { label: "Other Long", value: formatPercent(schemeInfo.other_long) },
                { label: "Other Short", value: formatPercent(schemeInfo.other_short) },
                { label: "Total Long", value: formatPercent(schemeInfo.total_long) },
                { label: "Total Short", value: formatPercent(schemeInfo.total_short) },
                { label: "% Assets in Top 10", value: formatPercent(schemeInfo.percent_assets_top_10) },
                { label: "Women Directors", value: formatPercent(schemeInfo.women_directors_percent) },
                { label: "Women Executives", value: formatPercent(schemeInfo.women_executives_percent) },
              ])}
            </CustomCard>
          ) : null}

          {schemeReturns.length > 0 ? (
            <>
              <Padding height={36} />
              <Typography size="4" weight="bold">
                Returns Snapshot
              </Typography>
              <Padding height={12} />
              <CustomCard>
                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                  <Typography size="2" weight="medium" style={styles.tableCell}>
                    Period
                  </Typography>
                  <Typography size="2" weight="medium" style={styles.tableCell}>
                    Fund
                  </Typography>
                  <Typography size="2" weight="medium" style={styles.tableCell}>
                    Category
                  </Typography>
                  <Typography size="2" weight="medium" style={styles.tableCell}>
                    Index
                  </Typography>
                </View>
                {schemeReturns.map((item: any, idx: number) => (
                  <View key={`${item.year}-${idx}`}>
                    <View style={styles.tableRow}>
                      <Typography size="2" style={styles.tableCell}>
                        {item.year}
                      </Typography>
                      <Typography size="2" style={styles.tableCell}>
                        {formatPercent(item.investment_return)}
                      </Typography>
                      <Typography size="2" style={styles.tableCell}>
                        {formatPercent(item.category_return)}
                      </Typography>
                      <Typography size="2" style={styles.tableCell}>
                        {formatPercent(item.index_return)}
                      </Typography>
                    </View>
                    {(item.percentile_rank ?? item.num_invest_in_cat ?? item.category_name) && (
                      <View style={styles.tableMetaRow}>
                        <Typography size="1" color={themeColor.gray[11]}>
                          Percentile Rank: {item.percentile_rank ?? "N/A"}
                        </Typography>
                        <Typography size="1" color={themeColor.gray[11]}>
                          Funds in Category: {item.num_invest_in_cat ?? "N/A"}
                        </Typography>
                        <Typography size="1" color={themeColor.gray[11]}>
                          Category: {item.category_name || "N/A"}
                        </Typography>
                      </View>
                    )}
                  </View>
                ))}
              </CustomCard>
            </>
          ) : null}

          {assetAllocation.length > 0 ? (
            <>
              <Padding height={36} />
              <Typography size="4" weight="bold">
                Asset Allocation
              </Typography>
              <Padding height={12} />
              <CustomCard>
                {assetAllocation.map((item: any, idx: number) => (
                  <FlexRow key={`${item.asset_class}-${idx}`} alignItems="center" justifyContent="space-between" wrap>
                    <View>
                      <Typography size="3" weight="medium">
                        {item.asset_class}
                      </Typography>
                      <Typography size="1" color={themeColor.gray[11]}>
                        As of {item.asof_date ? moment(item.asof_date).format("MMM YYYY") : "N/A"}
                      </Typography>
                    </View>
                    <View style={styles.assetValueWrapper}>
                      <Typography size="2" weight="medium">
                        {formatPercent(item.net)}
                      </Typography>
                      <Typography size="1" color={themeColor.gray[11]}>
                        Fund
                      </Typography>
                    </View>
                    <View style={styles.assetValueWrapper}>
                      <Typography size="2" weight="medium">
                        {formatPercent(item.category)}
                      </Typography>
                      <Typography size="1" color={themeColor.gray[11]}>
                        Category
                      </Typography>
                    </View>
                    <View style={styles.assetValueWrapper}>
                      <Typography size="2" weight="medium">
                        {formatPercent(item.index)}
                      </Typography>
                      <Typography size="1" color={themeColor.gray[11]}>
                        Index
                      </Typography>
                    </View>
                    <View style={styles.assetBreakdown}>
                      <View style={styles.assetMiniStat}>
                        <Typography size="1" color={themeColor.gray[11]}>
                          Long
                        </Typography>
                        <Typography size="2" weight="medium">
                          {formatPercent(item.long)}
                        </Typography>
                      </View>
                      <View style={styles.assetMiniStat}>
                        <Typography size="1" color={themeColor.gray[11]}>
                          Short
                        </Typography>
                        <Typography size="2" weight="medium">
                          {formatPercent(item.short)}
                        </Typography>
                      </View>
                    </View>
                  </FlexRow>
                ))}
              </CustomCard>
            </>
          ) : null}

          {managementTeam.length > 0 ? (
            <>
              <Padding height={36} />
              <Typography size="4" weight="bold">
                Management Team
              </Typography>
              <Padding height={12} />
              <CustomCard>
                {managementTeam.map((member: any) => (
                  <View key={member.id} style={styles.managerRow}>
                    <View style={{ flex: 1 }}>
                      <Typography size="3" weight="medium">
                        {member.manager_name}
                      </Typography>
                      <Typography size="1" color={themeColor.gray[11]}>
                        Since {member.start_date ? moment(member.start_date).format("MMM YYYY") : "N/A"}
                      </Typography>
                    </View>
                    {member.end_date ? (
                      <Typography size="2" color={themeColor.gray[11]}>
                        Till {moment(member.end_date).format("MMM YYYY")}
                      </Typography>
                    ) : (
                      <View style={[styles.statusBadge, { backgroundColor: themeColor.green[3] }]}>
                        <Typography size="1" weight="medium" color={themeColor.green[11]}>
                          Active
                        </Typography>
                      </View>
                    )}
                  </View>
                ))}
              </CustomCard>
            </>
          ) : null}

          <Padding height={36} />
          {renderHoldingsSection({
            title: "Equity Holdings",
            subtitle: equitySubtitle,
            holdings: sortedEquityHoldings,
            columns: equityColumns,
            showAll: showAllEquityHoldings,
            toggleShowAll: () => setShowAllEquityHoldings((prev) => !prev),
            emptyMessage: "Holdings data not available.",
          })}

          <Padding height={36} />
          {renderHoldingsSection({
            title: "Bond Holdings",
            subtitle: bondSubtitle,
            holdings: sortedBondHoldings,
            columns: bondColumns,
            showAll: showAllBondHoldings,
            toggleShowAll: () => setShowAllBondHoldings((prev) => !prev),
            emptyMessage: "Bond holdings not reported.",
          })}

          <Padding height={36} />
          {renderHoldingsSection({
            title: "Other Holdings",
            subtitle: otherSubtitle,
            holdings: sortedOtherHoldings,
            columns: otherColumns,
            showAll: showAllOtherHoldings,
            toggleShowAll: () => setShowAllOtherHoldings((prev) => !prev),
            emptyMessage: "No other holdings disclosed.",
          })}

          {marketVolatility.length > 0 ? (
            <>
              <Padding height={36} />
              <Typography size="4" weight="bold">
                Market Volatility
              </Typography>
              <Padding height={12} />
              <CustomCard>
                {marketVolatility.map((row: any, idx: number) => (
                  <View key={`vol-${row.id || idx}`} style={styles.listCard}>
                    {renderKeyValueGrid(recordToItems(row))}
                  </View>
                ))}
              </CustomCard>
            </>
          ) : null}

          {riskVolatility.length > 0 ? (
            <>
              <Padding height={36} />
              <Typography size="4" weight="bold">
                Risk & Volatility Metrics
              </Typography>
              <Padding height={12} />
              <CustomCard>
                {riskVolatility.map((row: any, idx: number) => (
                  <View key={`risk-${row.id || idx}`} style={styles.listCard}>
                    {renderKeyValueGrid(recordToItems(row))}
                  </View>
                ))}
              </CustomCard>
            </>
          ) : null}

          {marketCapBreakdown.length > 0 ? (
            <>
              <Padding height={36} />
              <Typography size="4" weight="bold">
                Market Cap Breakdown
              </Typography>
              <Padding height={12} />
              <CustomCard>
                {marketCapBreakdown.map((row: any, idx: number) => (
                  <View key={`cap-${row.id || idx}`} style={styles.listCard}>
                    {renderKeyValueGrid(recordToItems(row))}
                  </View>
                ))}
              </CustomCard>
            </>
          ) : null}

          {styleMeasures.length > 0 ? (
            <>
              <Padding height={36} />
              <Typography size="4" weight="bold">
                Style Measures
              </Typography>
              <Padding height={12} />
              <CustomCard>
                {styleMeasures.map((row: any, idx: number) => (
                  <View key={`style-${row.measure_of || idx}`} style={styles.listCard}>
                    {renderKeyValueGrid(recordToItems(row))}
                  </View>
                ))}
              </CustomCard>
            </>
          ) : null}

          {fundAnalysis.length > 0 ? (
            <>
              <Padding height={36} />
              <Typography size="4" weight="bold">
                Fund Analysis
              </Typography>
              <Padding height={12} />

              {fundAnalysis.map((analysis: any, idx: number) => {
                const processedProcessText = (analysis.processtext || []).filter(
                  (line: string | null) => line && line.trim()
                );
                return (
                  <CustomCard key={idx}>
                    {renderNarrativeBlock("Analysis", analysis.analysis)}
                    {renderNarrativeBlock("Process", analysis.process)}
                    {renderNarrativeBlock("People", analysis.people)}
                    {renderNarrativeBlock("Price", analysis.price)}
                    {renderNarrativeBlock("Performance", analysis.performance)}
                    {analysis.notes ? (
                      <View style={styles.narrativeBlock}>
                        <Typography size="3" weight="bold">
                          Notes
                        </Typography>
                        <Padding height={4} />
                        <Typography size="2" color={themeColor.gray[11]}>
                          {analysis.notes}
                        </Typography>
                      </View>
                    ) : null}
                    {processedProcessText.length ? (
                      <View style={styles.analysisList}>
                        {processedProcessText.map((text: string, textIdx: number) => (
                          <Typography
                            key={`processtext-${textIdx}`}
                            size="2"
                            color={themeColor.gray[11]}
                            style={styles.analysisBullet}
                          >
                            • {text}
                          </Typography>
                        ))}
                      </View>
                    ) : null}
                    {analysis.fetched_at ? (
                      <Typography size="1" color={themeColor.gray[11]}>
                        Synced {moment(analysis.fetched_at).format("D MMM YYYY, hh:mm A")}
                      </Typography>
                    ) : null}
                  </CustomCard>
                );
              })}
            </>
          ) : null}
        </>
      )}

      <InvestForm closeModal={closeInvestModal} isModalVisible={isInvestModalOpen} schemeId={data.id} />
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  sectionAccent: {
    width: 8,
    height: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  keyValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  keyValueText: {
    flex: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  helperText: {
    textAlign: "right",
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  tableMetaRow: {
    flexDirection: "column",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  tableHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.15)",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
  },
  cellRank: {
    flex: 0.8,
    textAlign: "center",
  },
  cellLarge: {
    flex: 3,
  },
  cellMedium: {
    flex: 2,
  },
  cellSmall: {
    flex: 1.2,
    textAlign: "right",
  },
  elevatedCard: {
    shadowColor: "#000000",
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  expandButton: {
    marginTop: 12,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  assetValueWrapper: {
    width: 80,
    alignItems: "flex-end",
  },
  assetBreakdown: {
    marginLeft: 12,
    alignItems: "flex-end",
  },
  assetMiniStat: {
    alignItems: "flex-end",
    marginBottom: 4,
  },
  managerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  listCard: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  tagPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  narrativeBlock: {
    marginBottom: 12,
  },
  analysisList: {
    marginBottom: 12,
  },
  analysisBullet: {
    marginBottom: 6,
  },
});

export default React.memo(SchemeDetails);
