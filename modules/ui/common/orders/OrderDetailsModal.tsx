import React, { useContext } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemeContext } from "@niveshstar/context";
import { formatBseDateTime, getOrderStatusDisplay } from "@niveshstar/utils";

import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

interface PropsType {
  data: any;
  isError: boolean;
  isLoading: boolean;
}

function OrderDetailsModal(props: PropsType) {
  const { data, isError, isLoading } = props;
  const { themeColor, isLight } = useContext(ThemeContext);

  if (isLoading) {
    return (
      <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
        <ActivityIndicator size={40} color={themeColor.accent[9]} />
      </FlexRow>
    );
  }

  if (!data || !data.success || isError) {
    return (
      <Typography size="2" color={themeColor.red[11]}>
        {data?.message ?? "An error occurred while fetching details"}
      </Typography>
    );
  }

  if (!data?.data) {
    return <Typography>Data unavailable</Typography>;
  }

  const order = data.data;
  const statusStyle = getOrderStatusDisplay(order.status, isLight);

  const folio = order.allotment_details?.folio ?? "-";
  const units = order.allotment_details?.allotment_units ?? order.rta_resp?.purchase?.units ?? "-";
  const nav = order.allotment_details?.allotment_nav ?? order.rta_resp?.purchase?.other_info?.nav ?? "-";
  const navDate = order.allotment_details?.nav_date ? formatBseDateTime(order.allotment_details.nav_date) : "-";
  const accountType = order.phys_or_demat === "p" ? "Physical" : order.phys_or_demat === "d" ? "Demat" : "-";

  return (
    <>
      <CustomCard>
        <Typography size="3" weight="bold" color={themeColor.gray[12]}>
          Order Summary
        </Typography>
        <Padding height={12} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Order ID:
          </Typography>
          <Typography size="2" weight="medium">
            {order.id || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Status:
          </Typography>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Typography size="1" weight="medium" color={statusStyle.text}>
              {statusStyle.label}
            </Typography>
          </View>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Placed At:
          </Typography>
          <Typography size="2" weight="medium">
            {formatBseDateTime(order.placed_at)}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Amount:
          </Typography>
          <Typography size="2" weight="medium">
            {order.amount} {order.is_units ? "Units" : order.cur}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Scheme:
          </Typography>
          <Typography size="2" weight="medium">
            {order.scheme || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            ISIN:
          </Typography>
          <Typography size="2" weight="medium">
            {order.order_src_info?.src_isin || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Order Type:
          </Typography>
          <Typography size="2" weight="medium">
            {order.type === "r" ? "Redemption" : "Lumpsum"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Folio:
          </Typography>
          <Typography size="2" weight="medium">
            {order.folio_num || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Account Type:
          </Typography>
          <Typography size="2" weight="medium">
            {accountType}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Investor UCC:
          </Typography>
          <Typography size="2" weight="medium">
            {order.investor?.ucc || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Member ID:
          </Typography>
          <Typography size="2" weight="medium">
            {order.member || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Fresh Order:
          </Typography>
          <Typography size="2" weight="medium">
            {order.is_fresh ? "Yes" : "No"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            KYC Passed:
          </Typography>
          <Typography size="2" weight="medium">
            {order.kyc_passed ? "Yes" : "No"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Settlement TAT:
          </Typography>
          <Typography size="2" weight="medium">
            {order.scheme_tat || "-"}
          </Typography>
        </FlexRow>
      </CustomCard>

      {(order.status === "done" || order.allotment_details || order.rta_resp?.purchase) && (
        <>
          <Padding height={16} />
          <CustomCard>
            <Typography size="3" weight="bold" color={themeColor.gray[12]}>
              Allotment Details
            </Typography>
            <Padding height={12} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Folio Number:
              </Typography>
              <Typography size="2" weight="medium">
                {folio}
              </Typography>
            </FlexRow>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Units Allotted:
              </Typography>
              <Typography size="2" weight="medium">
                {typeof units === "number" ? units.toFixed(4) : units}
              </Typography>
            </FlexRow>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                NAV:
              </Typography>
              <Typography size="2" weight="medium">
                {nav}
              </Typography>
            </FlexRow>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                NAV Date:
              </Typography>
              <Typography size="2" weight="medium">
                {navDate}
              </Typography>
            </FlexRow>
          </CustomCard>
        </>
      )}

      <Padding height={16} />

      {order.holder && order.holder.length > 0 && (
        <CustomCard>
          <Typography size="3" weight="bold" color={themeColor.gray[12]}>
            Holder Information
          </Typography>
          <Padding height={12} />
          {order.holder.map((holder: any, index: number) => (
            <View key={index}>
              {index > 0 && (
                <>
                  <Padding height={12} />
                  <View style={{ height: 1, backgroundColor: themeColor.gray[6] }} />
                  <Padding height={12} />
                </>
              )}
              <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                <Typography size="1" color={themeColor.gray[11]}>
                  Rank:
                </Typography>
                <Typography size="2" weight="medium">
                  {holder.holder_rank || "-"}
                </Typography>
              </FlexRow>
              <Padding height={8} />
              <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                <Typography size="1" color={themeColor.gray[11]}>
                  Email:
                </Typography>
                <Typography size="2" weight="medium">
                  {holder.email || "-"}
                </Typography>
              </FlexRow>
              <Padding height={8} />
              <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                <Typography size="1" color={themeColor.gray[11]}>
                  Mobile:
                </Typography>
                <Typography size="2" weight="medium">
                  {holder.mobnum || "-"}
                </Typography>
              </FlexRow>
              <Padding height={8} />
              <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                <Typography size="1" color={themeColor.gray[11]}>
                  Nomination Opted:
                </Typography>
                <Typography size="2" weight="medium">
                  {holder.is_nomination_opted ? "Yes" : "No"}
                </Typography>
              </FlexRow>
            </View>
          ))}
        </CustomCard>
      )}

      <Padding height={16} />

      <CustomCard>
        <Typography size="3" weight="bold" color={themeColor.gray[12]}>
          Payment & Settlement
        </Typography>
        <Padding height={12} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Payment Ref ID:
          </Typography>
          <Typography size="2" weight="medium">
            {order.payment_ref_id || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Settlement No:
          </Typography>
          <Typography size="2" weight="medium">
            {order.settlement_no || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Settlement Date:
          </Typography>
          <Typography size="2" weight="medium">
            {formatBseDateTime(order.settlement_date)}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Fund Receipt Date:
          </Typography>
          <Typography size="2" weight="medium">
            {formatBseDateTime(order.fund_receipt_date)}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Full Matched At:
          </Typography>
          <Typography size="2" weight="medium">
            {formatBseDateTime(order.full_matched_at)}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            RTA Response At:
          </Typography>
          <Typography size="2" weight="medium">
            {formatBseDateTime(order.rta_resp_at)}
          </Typography>
        </FlexRow>
      </CustomCard>

      <Padding height={16} />

      {(order.rejection_reason?.reason || order.rejection_reason?.by) && (
        <CustomCard>
          <Typography size="3" weight="bold" color={themeColor.red[12]}>
            Rejection Details
          </Typography>
          <Padding height={12} />
          <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
            <Typography size="1" color={themeColor.gray[11]}>
              Rejected By:
            </Typography>
            <Typography size="2" weight="medium" color={themeColor.red[11]}>
              {order.rejection_reason.by || "-"}
            </Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow justifyContent="space-between" alignItems="flex-start" colGap={8}>
            <Typography size="1" color={themeColor.gray[11]}>
              Reason:
            </Typography>
            <Typography size="2" weight="medium" color={themeColor.red[11]} style={{ flex: 1, textAlign: "right" }}>
              {order.rejection_reason.reason || "-"}
            </Typography>
          </FlexRow>
        </CustomCard>
      )}

      <Padding height={16} />

      {order.history && order.history.length > 0 && (
        <CustomCard>
          <Typography size="3" weight="bold" color={themeColor.gray[12]}>
            Order Timeline
          </Typography>
          <Padding height={12} />
          {order.history.map((event: any, idx: number) => (
            <View key={idx}>
              {idx > 0 && <Padding height={12} />}
              <FlexRow justifyContent="space-between" alignItems="flex-start" colGap={8}>
                <View style={{ flex: 1 }}>
                  <Typography size="2" weight="medium">
                    {getOrderStatusDisplay(event.event_status, true).label}
                  </Typography>
                  <Typography size="1" color={themeColor.gray[11]} style={{ marginTop: 4 }}>
                    {event.msg}
                  </Typography>
                </View>
                <Typography size="1" color={themeColor.gray[11]} style={{ textAlign: "right" }}>
                  {formatBseDateTime(event.when)}
                </Typography>
              </FlexRow>
            </View>
          ))}
        </CustomCard>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});

export default React.memo(OrderDetailsModal);
