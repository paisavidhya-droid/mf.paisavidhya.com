import React, { useCallback, useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { RootStateType, ScreenContext, ThemeContext } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { convertCurrencyToString } from "@niveshstar/utils";

import Button from "../../Button";
import Column from "../../Column";
import Divider from "../../Divider";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import InvestForm from "../home/InvestForm";

interface PropsType {
  data: any;
  returnYear: string;
  isFetching?: boolean;
  isLoadMoreVisible: boolean;
  handleNextPage: () => void;
}

const SIP_FREQ_LABELS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  FORTNIGHTLY: "Fortnightly",
  HALF_YEARLY: "Half Yearly",
  YEARLY: "Yearly",
};

function FundsList(props: PropsType) {
  const { data, handleNextPage, isLoadMoreVisible, isFetching = false } = props;

  const { navigator, params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [searchColSize, btnColSize] = screenType === "sm" ? [24, 24] : screenType === "md" ? [24, 24] : [20, 4];

  const openInvestModal = useCallback(() => {
    setIsInvestModalOpen(true);
  }, []);

  const closeInvestModal = useCallback(() => {
    setIsInvestModalOpen(false);
    setSelectedScheme(null);
  }, []);

  const handleSelectScheme = useCallback(
    (newScheme: any) => () => {
      setSelectedScheme(newScheme);
    },
    []
  );

  const handleNavigate = useCallback(
    (id: string) => () => {
      if (authDetail.userType === "investor") navigator.navigate("home", "mutual-funds/scheme", { schemeId: id });
      else navigator.navigate("home", "user", { ...params, userTab: "10", schemeId: id });
    },
    [authDetail.userType, navigator, params]
  );

  const getInvestmentOptions = useCallback((val: any) => {
    const options: Array<{ label: string; amount: string }> = [];

    // Add lumpsum if available
    if (val.purchase.flag && val.purchase.min_amt > 0) {
      options.push({
        label: "Lumpsum",
        amount: convertCurrencyToString(val.purchase.min_amt),
      });
    }

    // Add all available SIP frequencies
    Object.entries(val.sip).forEach(([key, value]: [string, any]) => {
      if (value.flag && value.min_amt > 0) {
        options.push({
          label: `SIP ${SIP_FREQ_LABELS[key as keyof typeof SIP_FREQ_LABELS] || key}`,
          amount: convertCurrencyToString(value.min_amt),
        });
      }
    });

    return options;
  }, []);

  useEffect(() => {
    if (!selectedScheme) return;
    openInvestModal();
  }, [selectedScheme, openInvestModal]);

  return (
    <>
      {data.map((val: any, i: number) => {
        const investmentOptions = getInvestmentOptions(val);

        return (
          <React.Fragment key={val.id}>
            <View style={styles.cell}>
              <FlexRow alignItems="center" offset={8} wrap>
                <Column col={searchColSize} offset={8}>
                  <FlexRow alignItems="center">
                    <Image source={{ uri: val.amc_img_url }} style={styles.img} />
                    <Padding width={8} />

                    <Pressable style={{ flex: 1 }} onPress={handleNavigate(val.id)}>
                      <Typography weight="medium" color={themeColor.gray[12]}>
                        {val.name}
                      </Typography>
                    </Pressable>
                  </FlexRow>
                </Column>

                <Column col={btnColSize} offset={8}>
                  <FlexRow justifyContent="flex-end">
                    <Button
                      title="View More"
                      variant="outline"
                      onPress={handleNavigate(val.id)}
                      typographyProps={{ size: "1" }}
                    />
                    <Padding width={8} />
                    <Button title="Invest" onPress={handleSelectScheme(val.id)} typographyProps={{ size: "1" }} />
                  </FlexRow>
                </Column>
              </FlexRow>

              <Padding height={16} />

              {investmentOptions.length > 0 && (
                <FlexRow colGap={8} rowGap={8} wrap>
                  {investmentOptions.map((option, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.pill,
                        {
                          backgroundColor: themeColor.gray[2],
                          borderColor: themeColor.accent[6],
                        },
                      ]}
                    >
                      <Typography size="1" color={themeColor.gray[11]}>
                        {option.label}
                      </Typography>
                      <Padding width={4} />
                      <Typography size="1" weight="medium" color={themeColor.accent[11]}>
                        {option.amount}
                      </Typography>
                    </View>
                  ))}
                </FlexRow>
              )}
            </View>
            {i === data.length - 1 ? null : (
              <>
                <Padding height={16} />
                <Divider />
                <Padding height={16} />
              </>
            )}
          </React.Fragment>
        );
      })}
      <Padding height={20} />
      {data.length === 0 ? <Typography size="3">No options found</Typography> : null}

      {isLoadMoreVisible ? (
        <FlexRow justifyContent="center">
          <Button title="Load More" onPress={handleNextPage} disabled={isFetching} loading={isFetching} />
        </FlexRow>
      ) : null}

      <InvestForm isModalVisible={isInvestModalOpen} closeModal={closeInvestModal} schemeId={selectedScheme} />
    </>
  );
}

const styles = StyleSheet.create({
  cell: {
    padding: 12,
  },
  img: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
});

export default React.memo(FundsList);
