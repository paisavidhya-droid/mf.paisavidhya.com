import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import moment from "moment";

import { ThemeContext } from "@niveshstar/context";

import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

interface PropsType {
  data: any;
  error: any;
}

function UccStatusModal(props: PropsType) {
  const { data, error } = props;
  const { themeColor } = useContext(ThemeContext);

  if (!data || !data.success || error) {
    return (
      <Typography size="2" color={themeColor.red[11]}>
        {data?.message ?? error?.data?.message ?? "An error occurred while fetching UCC status"}
      </Typography>
    );
  }

  if (!data?.data) {
    return <Typography>No UCC status data available</Typography>;
  }

  return (
    <>
      <CustomCard>
        <Typography size="3" weight="bold" color={themeColor.gray[12]}>
          UCC Status
        </Typography>
        <Padding height={12} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Status:
          </Typography>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  data.data.ucc_status === "ACTIVE"
                    ? themeColor.green[3]
                    : data.data.ucc_status === "PENDING_VERIFICATION"
                      ? themeColor.accent[3]
                      : themeColor.red[3],
              },
            ]}
          >
            <Typography
              size="1"
              weight="medium"
              color={
                data.data.ucc_status === "ACTIVE"
                  ? themeColor.green[11]
                  : data.data.ucc_status === "PENDING_VERIFICATION"
                    ? themeColor.accent[11]
                    : themeColor.red[11]
              }
            >
              {data.data.ucc_status}
            </Typography>
          </View>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Client Code:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.investor?.client_code || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Member ID:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.member?.member_id || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Tax Status:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.tax_status || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Holding Nature:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.holding_nature || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Tax Code:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.tax_code || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            RDMP IDCW Pay Mode:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.rdmp_idcw_pay_mode || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Nomination Auth Mode:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.nomination_auth_mode || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Communication Mode:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.comm_mode || "-"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Onboarding:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.onboarding || "-"}
          </Typography>
        </FlexRow>
        {data.data.nominee_soa && (
          <>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Nominee SOA:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.nominee_soa}
              </Typography>
            </FlexRow>
          </>
        )}
      </CustomCard>

      <Padding height={16} />

      <CustomCard>
        <Typography size="3" weight="bold" color={themeColor.gray[12]}>
          Account Type
        </Typography>
        <Padding height={12} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Physical:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.is_client_physical ? "Yes" : "No"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Demat:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.is_client_demat ? "Yes" : "No"}
          </Typography>
        </FlexRow>
        <Padding height={8} />
        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
          <Typography size="1" color={themeColor.gray[11]}>
            Nomination Opted:
          </Typography>
          <Typography size="2" weight="medium">
            {data.data.is_nomination_opted ? "Yes" : "No"}
          </Typography>
        </FlexRow>
      </CustomCard>

      <Padding height={16} />

      {data.data.holder && data.data.holder.length > 0 && (
        <>
          <CustomCard>
            <Typography size="3" weight="bold" color={themeColor.gray[12]}>
              Holder Information
            </Typography>
            <Padding height={12} />
            {data.data.holder.map((holder: any, index: number) => (
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
                    Name:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {holder.person
                      ? `${holder.person.first_name} ${holder.person.middle_name || ""} ${holder.person.last_name || ""}`.trim()
                      : "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    PAN:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {holder.identifier?.[0]?.identifier_number || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    PAN Verified:
                  </Typography>
                  <Typography
                    size="2"
                    weight="medium"
                    color={holder.is_pan_verified ? themeColor.green[11] : themeColor.red[11]}
                  >
                    {holder.is_pan_verified ? "Yes" : "No"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    KYC Type:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {holder.kyc_type || "-"}
                  </Typography>
                </FlexRow>
                {holder.contact?.[0] && (
                  <>
                    <Padding height={8} />
                    <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                      <Typography size="1" color={themeColor.gray[11]}>
                        Mobile:
                      </Typography>
                      <Typography size="2" weight="medium">
                        {holder.contact[0].contact_number || "-"}
                      </Typography>
                    </FlexRow>
                    <Padding height={8} />
                    <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                      <Typography size="1" color={themeColor.gray[11]}>
                        Email:
                      </Typography>
                      <Typography size="2" weight="medium">
                        {holder.contact[0].email_address || "-"}
                      </Typography>
                    </FlexRow>
                  </>
                )}
              </View>
            ))}
          </CustomCard>
          <Padding height={16} />
        </>
      )}

      {data.data.bank_account && data.data.bank_account.length > 0 && (
        <>
          <CustomCard>
            <Typography size="3" weight="bold" color={themeColor.gray[12]}>
              Bank Account
            </Typography>
            <Padding height={12} />
            {data.data.bank_account.map((bank: any, index: number) => (
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
                    Account Number:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {bank.bank_acc_num || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    IFSC Code:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {bank.ifsc_code || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Account Type:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {bank.bank_acc_type || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Verified:
                  </Typography>
                  <Typography
                    size="2"
                    weight="medium"
                    color={bank.is_verified ? themeColor.green[11] : themeColor.red[11]}
                  >
                    {bank.is_verified ? "Yes" : "No"}
                  </Typography>
                </FlexRow>
              </View>
            ))}
          </CustomCard>
          <Padding height={16} />
        </>
      )}

      {data.data.comm_addr && (
        <>
          <CustomCard>
            <Typography size="3" weight="bold" color={themeColor.gray[12]}>
              Communication Address
            </Typography>
            <Padding height={12} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Line1:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.comm_addr.address_line_1 || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />

            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Line2:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.comm_addr.address_line_2 || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />

            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Line3:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.comm_addr.address_line_3 || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />

            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                State:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.comm_addr.state || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />

            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                City:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.comm_addr.city || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />

            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Pincode:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.comm_addr.postalcodestr || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />

            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Country:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.comm_addr.country || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />
          </CustomCard>
          <Padding height={16} />
        </>
      )}

      {data.data.foreign_addr && (
        <>
          <CustomCard>
            <Typography size="3" weight="bold" color={themeColor.gray[12]}>
              Foreign Address
            </Typography>
            <Padding height={12} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Address Line 1:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.foreign_addr.address_line_1 || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                City:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.foreign_addr.city || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                State:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.foreign_addr.state || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Country:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.foreign_addr.country_name || data.data.foreign_addr.country || "-"}
              </Typography>
            </FlexRow>
            <Padding height={8} />
            <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
              <Typography size="1" color={themeColor.gray[11]}>
                Postal Code:
              </Typography>
              <Typography size="2" weight="medium">
                {data.data.foreign_addr.postalcode || "-"}
              </Typography>
            </FlexRow>
          </CustomCard>
          <Padding height={16} />
        </>
      )}

      {data.data.fatca && data.data.fatca.length > 0 && (
        <>
          <CustomCard>
            <Typography size="3" weight="bold" color={themeColor.gray[12]}>
              FATCA Details
            </Typography>
            <Padding height={12} />
            {data.data.fatca.map((fatca: any, index: number) => (
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
                    Client Name:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.client_name || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Investor Type:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.investor_type || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Tax Status:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.tax_status || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Country of Birth:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.country_of_birth || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Place of Birth:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.place_of_birth || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Date of Birth:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.dob ? moment(fatca.dob).format("DD/MM/YYYY") : "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Politically Exposed:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.politically_exposed || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Wealth Source:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.wealth_source || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Income Slab:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.income_slab || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Occupation Code:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.occ_code || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Occupation Type:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.occ_type || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Address Type:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.address_type || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Data Source:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.data_source || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Self Declared:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {fatca.is_self_declared ? "Yes" : "No"}
                  </Typography>
                </FlexRow>
                {fatca.identifier && (
                  <>
                    <Padding height={8} />
                    <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                      <Typography size="1" color={themeColor.gray[11]}>
                        Identifier Type:
                      </Typography>
                      <Typography size="2" weight="medium">
                        {fatca.identifier.identifier_type || "-"}
                      </Typography>
                    </FlexRow>
                    <Padding height={8} />
                    <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                      <Typography size="1" color={themeColor.gray[11]}>
                        Identifier Number:
                      </Typography>
                      <Typography size="2" weight="medium">
                        {fatca.identifier.identifier_number || "-"}
                      </Typography>
                    </FlexRow>
                    <Padding height={8} />
                    <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                      <Typography size="1" color={themeColor.gray[11]}>
                        Entity Sub State:
                      </Typography>
                      <Typography size="2" weight="medium">
                        {fatca.identifier.entity_sub_state || "-"}
                      </Typography>
                    </FlexRow>
                  </>
                )}
                {fatca.tax_residency && fatca.tax_residency.length > 0 && (
                  <>
                    <Padding height={8} />
                    <Typography size="2" weight="medium" color={themeColor.accent[11]}>
                      Tax Residency
                    </Typography>
                    {fatca.tax_residency.map((tax: any, taxIndex: number) => (
                      <View key={taxIndex}>
                        <Padding height={8} />
                        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                          <Typography size="1" color={themeColor.gray[11]}>
                            Country:
                          </Typography>
                          <Typography size="2" weight="medium">
                            {tax.country || "-"}
                          </Typography>
                        </FlexRow>
                        <Padding height={8} />
                        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                          <Typography size="1" color={themeColor.gray[11]}>
                            Tax ID Type:
                          </Typography>
                          <Typography size="2" weight="medium">
                            {tax.tax_id_type || "-"}
                          </Typography>
                        </FlexRow>
                        <Padding height={8} />
                        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                          <Typography size="1" color={themeColor.gray[11]}>
                            Tax ID Number:
                          </Typography>
                          <Typography size="2" weight="medium">
                            {tax.tax_id_no || "-"}
                          </Typography>
                        </FlexRow>
                      </View>
                    ))}
                  </>
                )}
                {fatca.npo && (
                  <>
                    <Padding height={8} />
                    <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                      <Typography size="1" color={themeColor.gray[11]}>
                        NPO RG No:
                      </Typography>
                      <Typography size="2" weight="medium">
                        {fatca.npo.npo_rg_no || "-"}
                      </Typography>
                    </FlexRow>
                  </>
                )}
                {fatca.ubo && Object.keys(fatca.ubo).length > 0 && (
                  <>
                    <Padding height={8} />
                    <Typography size="2" weight="medium" color={themeColor.accent[11]}>
                      UBO Details
                    </Typography>
                    {Object.entries(fatca.ubo).map(([key, value]: [string, any]) => (
                      <View key={key}>
                        <Padding height={8} />
                        <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                          <Typography size="1" color={themeColor.gray[11]}>
                            {key}:
                          </Typography>
                          <Typography size="2" weight="medium">
                            {value || "-"}
                          </Typography>
                        </FlexRow>
                      </View>
                    ))}
                  </>
                )}
              </View>
            ))}
          </CustomCard>
          <Padding height={16} />
        </>
      )}

      {data.data.identifiers && data.data.identifiers.length > 0 && (
        <>
          <CustomCard>
            <Typography size="3" weight="bold" color={themeColor.gray[12]}>
              Identifiers
            </Typography>
            <Padding height={12} />
            {data.data.identifiers.map((id: any, index: number) => (
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
                    Type:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {id.identifier_type || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    File Name:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {id.file_name || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    File Size:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {id.file_size ? `${id.file_size} bytes` : "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Blob ID:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {id.blob_id || "-"}
                  </Typography>
                </FlexRow>
                <Padding height={8} />
                <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                  <Typography size="1" color={themeColor.gray[11]}>
                    Active:
                  </Typography>
                  <Typography size="2" weight="medium">
                    {id.is_active ? "Yes" : "No"}
                  </Typography>
                </FlexRow>
              </View>
            ))}
          </CustomCard>
          <Padding height={16} />
        </>
      )}

      {data.data.ucc_status_object && (
        <CustomCard>
          <Typography size="3" weight="bold" color={themeColor.gray[12]}>
            Verification Details
          </Typography>
          <Padding height={12} />

          {data.data.ucc_status_object.transaction_ready?.map((tx: any, index: number) => (
            <View key={index}>
              {index > 0 && <Padding height={12} />}
              <Typography size="2" weight="medium" color={themeColor.accent[11]}>
                Transaction Status ({tx.mode})
              </Typography>
              <Padding height={8} />
              <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                <Typography size="1" color={themeColor.gray[11]}>
                  Status:
                </Typography>
                <Typography
                  size="2"
                  weight="medium"
                  color={tx.verified_status === "TRUE" ? themeColor.green[11] : themeColor.red[11]}
                >
                  {tx.verified_status === "TRUE" ? "Verified" : "Pending"}
                </Typography>
              </FlexRow>
              {tx.verification_failed_reason && (
                <>
                  <Padding height={8} />
                  <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                    <Typography size="1" color={themeColor.gray[11]}>
                      Reason:
                    </Typography>
                    <Typography size="1" color={themeColor.gray[11]} style={{ flex: 1, textAlign: "right" }}>
                      {tx.verification_failed_reason}
                    </Typography>
                  </FlexRow>
                </>
              )}
              {tx.verified_at && (
                <>
                  <Padding height={8} />
                  <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                    <Typography size="1" color={themeColor.gray[11]}>
                      Verified At:
                    </Typography>
                    <Typography size="1" weight="medium">
                      {moment(tx.verified_at).format("DD/MM/YYYY")}
                    </Typography>
                  </FlexRow>
                </>
              )}
            </View>
          ))}

          {data.data.ucc_status_object.holders?.map((holder: any, holderIndex: number) => (
            <View key={holderIndex}>
              <Padding height={16} />
              <View style={{ height: 1, backgroundColor: themeColor.gray[6] }} />
              <Padding height={12} />
              <Typography size="2" weight="medium" color={themeColor.accent[11]}>
                Holder {holder.holder_rank} - {holder.holder_pan}
              </Typography>

              {holder.kyc_status && (
                <>
                  <Padding height={12} />
                  <Typography size="2" weight="medium">
                    KYC Status
                  </Typography>
                  <Padding height={8} />
                  <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                    <Typography size="1" color={themeColor.gray[11]}>
                      Status:
                    </Typography>
                    <Typography
                      size="2"
                      weight="medium"
                      color={
                        holder.kyc_status.verified_status.toLowerCase() === "true"
                          ? themeColor.green[11]
                          : themeColor.red[11]
                      }
                    >
                      {holder.kyc_status.verified_status.toLowerCase() === "true" ? "Verified" : "Pending"}
                    </Typography>
                  </FlexRow>
                </>
              )}

              {holder.pan_verification && (
                <>
                  <Padding height={12} />
                  <Typography size="2" weight="medium">
                    PAN Verification
                  </Typography>
                  <Padding height={8} />
                  <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                    <Typography size="1" color={themeColor.gray[11]}>
                      Status:
                    </Typography>
                    <Typography
                      size="2"
                      weight="medium"
                      color={
                        holder.pan_verification.verified_status.toLowerCase() === "true"
                          ? themeColor.green[11]
                          : themeColor.red[11]
                      }
                    >
                      {holder.pan_verification.verified_status.toLowerCase() === "true" ? "Verified" : "Pending"}
                    </Typography>
                  </FlexRow>
                </>
              )}

              {holder.fatca_status && holder.fatca_status.length > 0 && (
                <>
                  <Padding height={12} />
                  <Typography size="2" weight="medium">
                    FATCA Status
                  </Typography>
                  {holder.fatca_status.map((fatca: any, fatcaIndex: number) => (
                    <View key={fatcaIndex}>
                      <Padding height={8} />
                      <FlexRow justifyContent="space-between" alignItems="center" colGap={8}>
                        <Typography size="1" color={themeColor.gray[11]}>
                          {fatca.rta_type}:
                        </Typography>
                        <Typography
                          size="2"
                          weight="medium"
                          color={fatca.verified_status === "TRUE" ? themeColor.green[11] : themeColor.red[11]}
                        >
                          {fatca.verified_status === "TRUE" ? "Verified" : "Pending"}
                        </Typography>
                      </FlexRow>
                    </View>
                  ))}
                </>
              )}
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

export default React.memo(UccStatusModal);
