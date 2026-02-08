import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";

import { amfiBroadOptions, amfiSubOptions, returnsOptions } from "@niveshstar/constant";
import { ThemeContext, useLazyGetSchemesQuery } from "@niveshstar/context";
import { useDebounce } from "@niveshstar/hook";

import ControlledRadio from "../../ControlledRadio";
import CustomCard from "../../CustomCard";
import CustomModal from "../../CustomModal";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import FundsList from "./FundsList";
import SearchFunds from "./SearchFunds";

const defaultValues = {
  query: "",
  amfiBroad: { value: "", name: "" },
  amfiSub: { value: "", name: "" },
  returnYear: { value: "yrs2", name: "2 Year" },
};

const pageSize = 10;

function SchemeList() {
  const [currPage, setCurrPage] = useState(1);
  const { themeColor } = useContext(ThemeContext);
  const [schemesData, setSchemesData] = useState([]);
  const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { control, watch, setValue } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const query = watch("query");
  const amfiSub = watch("amfiSub");
  const amfiBroad = watch("amfiBroad");
  const returnYear = watch("returnYear").value;
  const searchQuery = useDebounce(query, 300);

  const [getSchemesApi, { isLoading, isFetching }] = useLazyGetSchemesQuery();

  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);

  const getFundsData = useCallback(
    async (shouldAppend: boolean) => {
      const res = await getSchemesApi({
        page: currPage,
        limit: pageSize,
        schemeName: searchQuery,
      }).unwrap();

      setSchemesData((prevData) => (shouldAppend ? [...prevData, ...res.data.list] : res.data.list));
      setIsLoadMoreVisible(res.data.total <= pageSize * currPage ? false : true);
    },
    [currPage, searchQuery, getSchemesApi]
  );

  const handleNextPage = () => {
    setCurrPage(currPage + 1);
  };

  useEffect(() => {
    setValue("amfiSub", { name: "No filter", value: "" });
  }, [amfiBroad.value, setValue]);

  useEffect(() => {
    setCurrPage(1);
    getFundsData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amfiSub.value, amfiBroad.value, searchQuery, returnYear]);

  useEffect(() => {
    if (currPage <= 1) return;
    getFundsData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPage]);

  return (
    <>
      <CustomCard style={{ flexGrow: 1 }}>
        <SearchFunds control={control} onPressFilter={openFilterModal} />
        <Padding height={10} />
        {isLoading && schemesData.length === 0 ? (
          <FlexRow justifyContent="center" alignItems="center" style={{ flexGrow: 1 }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </FlexRow>
        ) : (
          <FundsList
            data={schemesData}
            isFetching={isFetching}
            returnYear={returnYear}
            handleNextPage={handleNextPage}
            isLoadMoreVisible={isLoadMoreVisible}
          />
        )}
      </CustomCard>

      <CustomModal
        title="Filter"
        minWidth={500}
        heightPercent={60}
        closeModal={closeFilterModal}
        isModalVisible={isFilterModalVisible}
      >
        <>
          <ControlledRadio name="returnYear" control={control} label="Return Year" options={returnsOptions} />
          <ControlledRadio name="amfiBroad" control={control} label="AMFI Broad" options={amfiBroadOptions} />
          <ControlledRadio
            name="amfiSub"
            label="AMFI Sub"
            control={control}
            options={amfiSubOptions[amfiBroad.value] || []}
          />
        </>
      </CustomModal>
    </>
  );
}

export default React.memo(SchemeList);
