import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import { ThemeContext, useLazyGetSxpBseHistoryQuery } from "@niveshstar/context";
import { convertCurrencyToString, formatBseDateTime, getOrderStatusDisplay } from "@niveshstar/utils";

import Button from "../../Button";
import CustomCard from "../../CustomCard";
import Divider from "../../Divider";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

interface SxpDetailsModalProps {
  data: any;
  id: string;
  isError: boolean;
  isLoading: boolean;
}

function SxpDetailsModal(props: SxpDetailsModalProps) {
  const { data, isError, isLoading, id } = props;
  const { themeColor, isLight } = useContext(ThemeContext);

  const [getSxpBseHistoryApi, { isLoading: isGettingSxpBseHistory, data: sxpBseHistoryData }] =
    useLazyGetSxpBseHistoryQuery();

  if (isLoading) {
    return (
      <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
        <Typography size="2">Loading...</Typography>
      </FlexRow>
    );
  }

  if (!data || isError) {
    return (
      <Typography size="2" color={themeColor.red[11]}>
        {data?.message ?? "An error occurred while fetching SXP details"}
      </Typography>
    );
  }

  if (!data.data?.sxp) {
    return <Typography>Data unavailable</Typography>;
  }

  const sxp = data.data.sxp;
  const statusStyle = getOrderStatusDisplay(sxp.status, isLight);

  return (
    <>
      <CustomCard>
        <Typography size="3" weight="bold" color={themeColor.gray[12]}>
          SXP Details
        </Typography>
        <Padding height={16} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            SXP Type:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.sxp_type || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Ref ID:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.mem_sxp_ref_id || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            UCC:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.ucc || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Member:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.member || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Source Scheme:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.src_scheme || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Amount:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.amount} {sxp.cur}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Start Date:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.start_date || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            End Date:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.end_date || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Frequency:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.freq || "-"}
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
            Next Due Date:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.next_due_date || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Email:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.email || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Mobile:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.mobnum || "-"}
          </Typography>
        </FlexRow>
      </CustomCard>
      <Padding height={16} />
      <CustomCard>
        <Typography size="3" weight="bold" color={themeColor.gray[12]}>
          Additional Information
        </Typography>
        <Padding height={16} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            First Order Today:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.first_order_today ? "Yes" : "No"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <Typography size="2" weight="bold" color={themeColor.gray[11]}>
          Bank Account
        </Typography>
        <Padding height={4} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            IFSC:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.bank_acct?.ifsc || "-"}
          </Typography>
        </FlexRow>
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Account No:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.bank_acct?.no || "-"}
          </Typography>
        </FlexRow>
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Type:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.bank_acct?.type || "-"}
          </Typography>
        </FlexRow>
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Name:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.bank_acct?.name || "-"}
          </Typography>
        </FlexRow>

        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            KYC Passed:
          </Typography>
          <Typography size="2" weight="medium">
            {sxp.kyc_passed ? "Yes" : "No"}
          </Typography>
        </FlexRow>
      </CustomCard>
      <Padding height={16} />

      {sxp.holder && sxp.holder.length > 0 ? (
        <CustomCard>
          <Typography size="3" weight="bold" color={themeColor.gray[12]}>
            Holder Information
          </Typography>
          <Padding height={16} />
          {sxp.holder.map((holder: any, index: number) => (
            <View key={index}>
              {index > 0 && (
                <>
                  <Padding height={16} />
                  <View style={{ height: 1, backgroundColor: themeColor.gray[6] }} />
                  <Padding height={16} />
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
            </View>
          ))}
        </CustomCard>
      ) : null}
      <Padding height={16} />
      {sxp.history && sxp.history.length > 0 ? (
        <CustomCard>
          <Typography size="3" weight="bold" color={themeColor.gray[12]}>
            SXP Timeline
          </Typography>
          <Padding height={16} />
          {sxp.history.map((event: any, idx: number) => (
            <View key={idx}>
              {idx > 0 ? <Padding height={16} /> : null}
              <FlexRow justifyContent="space-between" alignItems="flex-start" colGap={8}>
                <View style={{ flex: 1 }}>
                  <Typography size="2" weight="medium">
                    {event.event_status}
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
      ) : null}

      <Padding height={16} />

      <CustomCard>
        <Typography size="3" weight="bold" color={themeColor.gray[12]}>
          Transaction History
        </Typography>

        <Padding height={16} />

        {!sxpBseHistoryData && (
          <Button
            variant="outline"
            title="Fetch Transaction History"
            loading={isGettingSxpBseHistory}
            disabled={isGettingSxpBseHistory}
            onPress={() => getSxpBseHistoryApi(id)}
          />
        )}

        {isGettingSxpBseHistory || !sxpBseHistoryData
          ? null
          : sxpBseHistoryData.lists.map((val: any, orderIndex: number) => {
              if (!val?.history?.length) return null;

              return (
                <View key={val.id}>
                  <View
                    style={{
                      backgroundColor: themeColor.gray[3],
                      padding: 12,
                      borderRadius: 8,
                    }}
                  >
                    <Typography size="2" weight="bold">
                      Order ID: {val.id}
                    </Typography>
                    <Typography size="1" color={themeColor.gray[11]}>
                      Amount: {convertCurrencyToString(val.amount)}
                    </Typography>
                  </View>

                  <Padding height={12} />

                  {val.history.map((event: any, idx: number) => (
                    <View key={idx} style={{ flexDirection: "row" }}>
                      <View style={{ width: 8, alignItems: "center" }}>
                        <View style={[styles.timeline, { backgroundColor: themeColor.accent[9] }]} />
                        {idx !== val.history.length - 1 && (
                          <View
                            style={{
                              flex: 1,
                              width: 1,
                              backgroundColor: themeColor.gray[6],
                              marginTop: 4,
                            }}
                          />
                        )}
                      </View>

                      <View style={{ flex: 1, paddingLeft: 12 }}>
                        <Typography size="2" weight="medium">
                          {event.event_status}
                        </Typography>
                        <Typography size="1" color={themeColor.gray[11]}>
                          {event.msg}
                        </Typography>
                        <Typography size="1" color={themeColor.gray[10]} style={{ marginTop: 4 }}>
                          {formatBseDateTime(event.when)}
                        </Typography>

                        {idx !== val.history.length - 1 && <Padding height={16} />}
                      </View>
                    </View>
                  ))}

                  {orderIndex !== sxpBseHistoryData.lists.length - 1 ? (
                    <>
                      <Padding height={16} />
                      <Divider />
                      <Padding height={16} />
                    </>
                  ) : null}
                </View>
              );
            })}
      </CustomCard>
    </>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeline: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
});

export default React.memo(SxpDetailsModal);
