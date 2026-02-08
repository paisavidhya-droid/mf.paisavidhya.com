import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSelector } from "react-redux";

import { RootStateType, ScreenContext, ThemeContext } from "@niveshstar/context";

import CustomModal from "../../CustomModal";
import EmptyResult from "../../EmptyResult";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Table, { ColumnsType } from "../../Table";
import Typography from "../../Typography";
import TransactionModal from "../TransactionModal";
import HoldingsMenu from "./HoldingsMenu";
import HoldingsRow from "./HoldingsRow";
import RedeemForm from "./RedeemForm";

interface PropsType {
  data: any;
  isLoading: boolean;
}

function HoldingsTable(props: PropsType) {
  const { data, isLoading } = props;

  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [selectedScheme, setSelectedScheme] = useState({ index: -1, purpose: null });
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [isRedemptionModalVisible, setIsRedemptionModalVisible] = useState(false);

  const numColumns = screenType === "sm" ? 1 : screenType === "md" ? 2 : 3;

  const openTransactionModal = useCallback(() => {
    setIsTransactionModalVisible(true);
  }, []);

  const closeTransactionModal = useCallback(() => {
    setIsTransactionModalVisible(false);
    setSelectedScheme({ index: -1, purpose: null });
  }, []);

  const openRedemptionModal = useCallback(() => {
    setIsRedemptionModalVisible(true);
  }, []);

  const closeRedemptionModal = useCallback(() => {
    setIsRedemptionModalVisible(false);
  }, []);

  const handleSelectScheme = useCallback((index: number, purpose: "TRANSACTION" | "LUMPSUM" | "REDEEM") => {
    setSelectedScheme({ index, purpose });
  }, []);

  const initialColumns: ColumnsType[] = useMemo<ColumnsType[]>(
    () => [
      {
        key: "scheme_name",
        name: "Scheme Name",
        width: 350,
      },
      {
        key: "total_units",
        name: "Units",
        width: 150,
      },
      {
        key: "total_investment_amount",
        name: "Investment",
        width: 150,
        rupee: true,
      },
      {
        key: "current_value",
        name: "Current Value",
        width: 150,
        rupee: true,
      },
      {
        key: "absolute_return_percent",
        name: "Gains",
        width: 150,
        RenderCell: ({ value }) => (
          <Typography color={value.absolute_return_percent >= 0 ? themeColor.green[9] : themeColor.red[9]}>
            {value.absolute_return_percent}%
          </Typography>
        ),
      },
    ],
    [themeColor]
  );

  const lastColumn: ColumnsType = useMemo<ColumnsType>(
    () => ({
      key: "action",
      name: "Action",
      width: 100,
      sortable: false,
      headerAlignment: "center",
      RenderCell: ({ index }) => (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <HoldingsMenu selectScheme={handleSelectScheme} index={index} />
        </View>
      ),
    }),
    [handleSelectScheme]
  );

  const optionalColumns: ColumnsType[] = useMemo<ColumnsType[]>(
    () => [
      {
        key: "xirr",
        name: "XIRR",
        width: 150,
      },
      {
        key: "latest_nav",
        name: "Nav",
        width: 150,
      },
    ],
    []
  );

  useEffect(() => {
    if (selectedScheme.index === -1 || !selectedScheme.purpose) return;
    if (selectedScheme.purpose === "TRANSACTION") openTransactionModal();
    else if (selectedScheme.purpose === "REDEEM") openRedemptionModal();
  }, [selectedScheme, openTransactionModal, openRedemptionModal]);

  return (
    <>
      {screenType === "sm" ? null : (
        <>
          <Typography size="5" weight="medium">
            Holdings
          </Typography>
          <Padding height={24} />
        </>
      )}

      {isLoading ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {!isLoading && authDetail.userType === "investor" ? (
        <FlashList
          data={data}
          estimatedItemSize={200}
          numColumns={numColumns}
          nestedScrollEnabled={false}
          ListEmptyComponent={EmptyResult}
          keyExtractor={(item: any) => item.amfi_code}
          contentContainerStyle={{ paddingBottom: 8 }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item, index }) => (
            <View style={[{ flex: 1 }, index % numColumns !== 0 ? { marginLeft: 16 } : {}]}>
              <HoldingsRow data={item} selectScheme={handleSelectScheme} index={index} />
            </View>
          )}
        />
      ) : null}

      {!isLoading && authDetail.userType === "partner" ? (
        <Table
          id="isin"
          flexKey="schemeName"
          lastColumn={lastColumn}
          initialColumns={initialColumns}
          optionalColumns={optionalColumns}
          data={data}
        />
      ) : null}

      <CustomModal
        maxWidth={900}
        heightPercent={70}
        title="Transaction"
        closeModal={closeTransactionModal}
        isModalVisible={isTransactionModalVisible}
      >
        <TransactionModal data={selectedScheme.index === -1 ? [] : data[selectedScheme.index].cash_flows} />
      </CustomModal>

      <RedeemForm
        closeModal={closeRedemptionModal}
        isModalVisible={isRedemptionModalVisible}
        schemeId={selectedScheme.index === -1 ? undefined : data[selectedScheme.index].scheme_id}
      />
    </>
  );
}

export default React.memo(HoldingsTable);
