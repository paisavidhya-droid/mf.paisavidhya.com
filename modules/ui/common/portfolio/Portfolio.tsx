import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { portfolioData as dummyData } from "@niveshstar/constant";
import { PLatformUtil } from "@niveshstar/context";
import { formatDate } from "@niveshstar/utils";

import CustomCard from "../../CustomCard";
import CustomModal from "../../CustomModal";
import Table, { ColumnsType } from "../../Table";
import LumpsumModal from "../LumpsumModal";
import RedeemModal from "../RedeemModal";
import STPModal from "../STPModal";
import PortfolioRow from "./PortfolioRow";

export type PurposeType = "transaction" | "redeem" | "transfer" | "stp" | "swp" | "lumpsum";

const initialColumns = [
  { key: "amc", name: "AMC", width: 350, rupee: false },
  { key: "total", name: "Invested", width: 150, rupee: true },
  { key: "val", name: "Current", width: 150, rupee: true },
  { key: "gain", name: "Appritiation", width: 130, rupee: false },
  { key: "abs", name: "ABS", width: 120, rupee: false },
];

const optionalColumns = [{ key: "xiir", name: "XIRR", width: 120, rupee: false }];

const transactionInitialColums: ColumnsType[] = [
  { key: "subtype", name: "Tran. Type", width: 300 },
  { key: "trandate", name: "Date", width: 120 },
  { key: "units", name: "Units", width: 120 },
  { key: "purprice", name: "Purchase Price", width: 150, rupee: true },
  { key: "amount", name: "Invested", width: 150, rupee: true },
  { key: "cval", name: "Current", width: 150, rupee: true },
];

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(dummyData);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [isLumpsumModalVisible, setIsLumpsumModalVisible] = useState(false);
  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState(false);
  const [isStpModalVisible, setIsStpModalVisible] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const { control, setValue, watch } = useForm({
    defaultValues: {
      scheme: { name: "", value: "" },
      folio: { name: "", value: "" },
      scheme_name: "",
      amount: "",
      redemption_by: { name: "", value: "" },
      installment_count: "",
      frequency: { name: "", value: "" },
      start_date: PLatformUtil.isWeb ? formatDate(new Date()) : new Date(),
      first_order_today: true,
    },
    reValidateMode: "onSubmit",
  });

  const redemptionBy = watch("redemption_by");

  const openTransactionModal = () => {
    setIsTransactionModalVisible(true);
  };
  const closeTransactionModal = () => {
    setIsTransactionModalVisible(false);
    setSelectedScheme(null);
  };

  const openLumpsumnModal = () => {
    setIsLumpsumModalVisible(true);
  };
  const closeLumpsumModal = () => {
    setIsLumpsumModalVisible(false);
    setSelectedScheme(null);
  };

  const openRedeemModal = () => {
    setIsRedeemModalVisible(true);
  };
  const closeRedeemModal = () => {
    setIsRedeemModalVisible(false);
    setSelectedScheme(null);
  };

  const openStpModal = () => {
    setIsStpModalVisible(true);
  };
  const closeStpModal = () => {
    setIsStpModalVisible(false);
    setSelectedScheme(null);
  };

  const handleSelectScheme = useCallback((scheme: any, purpose: PurposeType) => {
    setSelectedScheme({ ...scheme, purpose });
  }, []);

  useEffect(() => {
    if (!selectedScheme || !selectedScheme.purpose) return;

    setValue("scheme_name", selectedScheme.scheme);
    setValue("scheme", { value: selectedScheme.id, name: selectedScheme.name });
    setValue("folio", { value: selectedScheme.folio, name: selectedScheme.folio });

    if (selectedScheme.purpose === "transaction") openTransactionModal();
    if (selectedScheme.purpose === "lumpsum") openLumpsumnModal();
    if (selectedScheme.purpose === "redeem") openRedeemModal();
    if (selectedScheme.purpose === "stp") openStpModal();
  }, [selectedScheme]);

  return (
    <CustomCard style={{ flex: 1 }}>
      <Table
        data={portfolioData.portfoilo[0].in[0].amc}
        initialColumns={initialColumns}
        flexKey="amc"
        id="amccode"
        optionalColumns={optionalColumns}
        RenderRow={(props) => <PortfolioRow {...props} handleSelectScheme={handleSelectScheme} />}
      />

      <CustomModal
        isModalVisible={isTransactionModalVisible}
        closeModal={closeTransactionModal}
        title="Transaction"
        onConfirm={closeTransactionModal}
        footerTitles={["Close"]}
        maxWidth="100%"
        scrollable
      >
        <Table
          data={selectedScheme?.transactions || []}
          id="id"
          noFlatList
          noSort
          initialColumns={transactionInitialColums}
          flexKey="subtype"
        />
      </CustomModal>

      <CustomModal
        isModalVisible={isLumpsumModalVisible}
        closeModal={closeLumpsumModal}
        title="Additional Lumpsum"
        onConfirm={closeLumpsumModal}
        footerTitles={["Close"]}
        scrollable
      >
        <LumpsumModal control={control} />
      </CustomModal>

      <CustomModal
        isModalVisible={isRedeemModalVisible}
        closeModal={closeRedeemModal}
        title="Redemption"
        onConfirm={closeRedeemModal}
        footerTitles={["Close"]}
        scrollable
      >
        <RedeemModal control={control} redemptionBy={redemptionBy.value} />
      </CustomModal>

      <CustomModal
        isModalVisible={isStpModalVisible}
        closeModal={closeStpModal}
        title="Add STP"
        onConfirm={closeStpModal}
        footerTitles={["Close"]}
        scrollable
      >
        <STPModal control={control} />
      </CustomModal>
    </CustomCard>
  );
}
