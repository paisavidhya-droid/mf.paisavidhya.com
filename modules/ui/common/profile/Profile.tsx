import React, { useContext } from "react";
import { ActivityIndicator } from "react-native";

import { ScreenContext, ThemeContext, useGetInvestorProfileQuery } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import Column from "../../Column";
import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import AddressDetails from "./AddressDetails";
import BankDetails from "./BankDetails";
import BseDetails from "./BseDetails";
import CommunicationDetails from "./CommunicationDetails";
import NomineeDetails from "./NomineeDetails";
import PersonalDetails from "./PersonalDetails";

function Profile() {
  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);

  const { data: investorProfile = { data: null }, isFetching: isFetchingInvestorProfile } = useGetInvestorProfileQuery(
    params.investorId,
    {
      skip: !params?.investorId,
    }
  );

  const columnSize = screenType === "sm" ? 24 : screenType === "md" ? 12 : 8;

  return (
    <>
      {isFetchingInvestorProfile ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {isFetchingInvestorProfile || !investorProfile.data ? null : (
        <>
          <FlexRow offset={8} alignItems="stretch" rowGap={16} wrap>
            <Column col={columnSize} offset={8} style={{ zIndex: 4 }}>
              <CustomCard style={{ flexGrow: 1 }}>
                <PersonalDetails investorProfile={investorProfile.data} />
              </CustomCard>
            </Column>

            <Column col={columnSize} offset={8} style={{ zIndex: 3 }}>
              <CustomCard style={{ flexGrow: 1 }}>
                <AddressDetails investorProfile={investorProfile.data} />
              </CustomCard>
            </Column>

            <Column col={columnSize} offset={8} style={{ zIndex: 2 }}>
              <CustomCard style={{ flexGrow: 1 }}>
                <BankDetails investorProfile={investorProfile.data} />
              </CustomCard>
            </Column>

            <Column col={columnSize} offset={8} style={{ zIndex: 1 }}>
              <CustomCard style={{ flexGrow: 1 }}>
                <CommunicationDetails investorProfile={investorProfile.data} />
              </CustomCard>
            </Column>

            <Column col={columnSize} offset={8} style={{ zIndex: 0 }}>
              <CustomCard style={{ flexGrow: 1 }}>
                <BseDetails investorProfile={investorProfile.data} />
              </CustomCard>
            </Column>

            <Column col={columnSize} offset={8} style={{ zIndex: 0 }}>
              <CustomCard style={{ flexGrow: 1 }}>
                <NomineeDetails investorProfile={investorProfile.data} />
              </CustomCard>
            </Column>
          </FlexRow>
        </>
      )}
    </>
  );
}

export default React.memo(Profile);
