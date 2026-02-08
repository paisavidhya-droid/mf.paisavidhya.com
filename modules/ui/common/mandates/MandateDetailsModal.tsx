import React, { useContext } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemeContext } from "@niveshstar/context";
import { formatBseDateTime, getMandateStatusDisplay } from "@niveshstar/utils";

import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

interface PropsType {
  data: any;
  isError: any;
  isLoading: boolean;
}

function MandateDetailsModal(props: PropsType) {
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

  const mandate = data.data;
  const statusInfo = getMandateStatusDisplay(mandate.status, isLight);

  return (
    <>
      <CustomCard>
        <Typography size="3" weight="bold" color={themeColor.gray[12]}>
          Mandate Summary
        </Typography>
        <Padding height={12} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Mandate ID:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.exch_mandate_id || "-"}
          </Typography>
        </FlexRow>
        {mandate.umrn != null && (
          <>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                UMRN:
              </Typography>
              <Typography size="2" weight="medium">
                {mandate.umrn || "-"}
              </Typography>
            </FlexRow>
          </>
        )}
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Status:
          </Typography>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Typography size="1" weight="medium" color={statusInfo.text}>
              {statusInfo.label}
            </Typography>
          </View>
        </FlexRow>

        {mandate.is_active != null && (
          <>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Active:
              </Typography>
              <Typography size="2" weight="medium">
                {mandate.is_active ? "Yes" : "No"}
              </Typography>
            </FlexRow>
          </>
        )}

        {mandate.is_verified != null && (
          <>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Verified:
              </Typography>
              <Typography size="2" weight="medium">
                {mandate.is_verified ? "Yes" : "No"}
              </Typography>
            </FlexRow>
          </>
        )}

        {mandate.verified_on_org && (
          <>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Verified On:
              </Typography>
              <Typography size="2" weight="medium">
                {formatBseDateTime(mandate.verified_on_org)}
              </Typography>
            </FlexRow>
          </>
        )}

        {mandate.verified_by_org && (
          <>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Verified By:
              </Typography>
              <Typography size="2" weight="medium">
                {mandate.verified_by_org}
              </Typography>
            </FlexRow>
          </>
        )}

        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Registered On:
          </Typography>
          <Typography size="2" weight="medium">
            {formatBseDateTime(mandate.reg_date)}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Start Date:
          </Typography>
          <Typography size="2" weight="medium">
            {formatBseDateTime(mandate.start_date)}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Valid Till:
          </Typography>
          <Typography size="2" weight="medium">
            {formatBseDateTime(mandate.valid_till)}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Max Transaction Amount:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.max_txn_amt} {mandate.cur}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Type:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.type === "U" ? "UPI" : mandate.type === "N" ? "Net Banking" : mandate.type || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Approved By:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.approved_by || "-"}
          </Typography>
        </FlexRow>
      </CustomCard>

      <Padding height={16} />

      <CustomCard>
        <Typography size="3" weight="bold" color={themeColor.gray[12]}>
          Investor Details
        </Typography>
        <Padding height={12} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Name:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.ucc_name || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            UCC:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.ucc || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Member:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.member || "-"}
          </Typography>
        </FlexRow>
      </CustomCard>

      <Padding height={16} />

      <CustomCard>
        <Typography size="3" weight="bold" color={themeColor.gray[12]}>
          Bank Details
        </Typography>
        <Padding height={12} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Account Number:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.investor_bank_details?.no || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            IFSC:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.investor_bank_details?.ifsc || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Bank Name:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.investor_bank_details?.name || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Branch:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.investor_bank_details?.branch || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Account Type:
          </Typography>
          <Typography size="2" weight="medium">
            {mandate.investor_bank_details?.type === "SB" ? "Savings" : mandate.investor_bank_details?.type || "-"}
          </Typography>
        </FlexRow>
        {mandate.investor_bank_details?.vpa?.length > 0 && (
          <>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                UPI ID:
              </Typography>
              <Typography size="2" weight="medium">
                {mandate.investor_bank_details.vpa.join(", ") || "-"}
              </Typography>
            </FlexRow>
          </>
        )}
      </CustomCard>

      <Padding height={16} />

      {mandate.others && (
        <CustomCard>
          <Typography size="3" weight="bold" color={themeColor.gray[12]}>
            Mandate Configuration
          </Typography>
          <Padding height={12} />
          <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
            <Typography size="1" color={themeColor.gray[11]}>
              Mode:
            </Typography>
            <Typography size="2" weight="medium">
              {mandate.others.mode === "ACH"
                ? "ACH"
                : mandate.others.mode === "DD"
                  ? "Direct Debit"
                  : mandate.others.mode || "-"}
            </Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
            <Typography size="1" color={themeColor.gray[11]}>
              Frequency:
            </Typography>
            <Typography size="2" weight="medium">
              {mandate.others.frequency || "-"}
            </Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
            <Typography size="1" color={themeColor.gray[11]}>
              Debit Type:
            </Typography>
            <Typography size="2" weight="medium">
              {mandate.others.debit_type || "-"}
            </Typography>
          </FlexRow>
          {mandate.others.mem_details?.agency_name && (
            <>
              <Padding height={8} />
              <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                <Typography size="1" color={themeColor.gray[11]}>
                  Agency:
                </Typography>
                <Typography size="2" weight="medium">
                  {mandate.others.mem_details.agency_name}
                </Typography>
              </FlexRow>
            </>
          )}
        </CustomCard>
      )}

      <Padding height={16} />

      {mandate.audit_trail?.length > 0 && (
        <CustomCard>
          <Typography size="3" weight="bold" color={themeColor.gray[12]}>
            Audit Trail
          </Typography>
          <Padding height={12} />
          {mandate.audit_trail.map((event: any, idx: number) => (
            <View key={`${event.event_status}-${idx}`}>
              {idx > 0 && <Padding height={12} />}
              <FlexRow justifyContent="space-between" alignItems="flex-start" colGap={8}>
                <View style={{ flex: 1 }}>
                  <Typography size="2" weight="medium">
                    {getMandateStatusDisplay(event.event_status, true).label}
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

export default React.memo(MandateDetailsModal);
