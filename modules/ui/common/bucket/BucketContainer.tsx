import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { monthOptions } from "@niveshstar/constant";
import {
  RootStateType,
  ThemeContext,
  useDeleteBucketMutation,
  useGetBucketQuery,
  usePostBucketPurchaseMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { convertCurrencyToString, getSipDurationOptions, toastHelper } from "@niveshstar/utils";

import Button from "../../Button";
import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import CustomCard from "../../CustomCard";
import CustomModal from "../../CustomModal";
import EmptyResult from "../../EmptyResult";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import BucketForm from "./BucketForm";
import BucketList from "./BucketList";
import BucketReturn from "./BucketReturn";

const monthlySipDurationOptions = getSipDurationOptions("MONTHLY");

interface PropsType {
  isParentAModal?: boolean;
  reRenderParent?: () => void;
  closeParentModal?: () => void;
}

const currentMonth = monthOptions.filter((val) => val.value === moment().add(4, "days").month());

const defaultValues = {
  amount: "",
  scheme_list: [],
  start_day: { name: "", value: "" },
  start_month: { name: currentMonth[0].name, value: currentMonth[0].value },
  start_year: moment().add(4, "days").year().toString(),
  sip_duration: { name: "", value: "" },
};

function BucketContainer(props: PropsType) {
  const { isParentAModal = false, closeParentModal } = props;

  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
  const [isBucketModalVisible, setIsBucketModalVisible] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState({ index: -1, purpose: "" });
  const [isPurchaseBucketModalVisible, setIsPurchaseBucketModalVisible] = useState(false);

  const authDetail = useSelector((state: RootStateType) => state.auth);

  const { control, handleSubmit, reset, watch, setValue, getValues } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const portfolioAmount = watch("amount");

  const [deleteBucketApi, { isLoading: isDeletingBucket }] = useDeleteBucketMutation();
  const { data: bucketData = [], isLoading: isGettingBucket } = useGetBucketQuery(undefined);
  const [postBucketPurchaseApi, { isLoading: isPostingBucketPurchase }] = usePostBucketPurchaseMutation();

  const openPurchaseBucketModal = useCallback(() => {
    setIsPurchaseBucketModalVisible(true);
  }, []);
  const closePurchaseBucketModal = useCallback(() => {
    setIsPurchaseBucketModalVisible(false);
    setSelectedBucket({ index: -1, purpose: "" });
  }, []);

  const onBucketPurchase = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const bucket = bucketData[selectedBucket.index];

        let startDate, ninstallments;

        if (bucket.investment_mode === "SIP") {
          startDate = moment({
            year: Number(data.start_year),
            month: Number(data.start_month.value),
            date: Number(data.start_day.value),
          });

          ninstallments = data.sip_duration.value;
        }

        const payload = {
          amount: parseFloat(data.amount),
          start_date: startDate,
          ninstallments: ninstallments,
        };

        const investorId = authDetail.userType === "investor" ? undefined : params.investorId;
        await postBucketPurchaseApi({ id: bucket.id, investorId: investorId, payload: payload }).unwrap();

        reset();
        closePurchaseBucketModal();
        if (closeParentModal) closeParentModal();
      } catch {
        //do nothing
      }
    },
    [
      reset,
      params,
      bucketData,
      authDetail,
      closeParentModal,
      selectedBucket.index,
      postBucketPurchaseApi,
      closePurchaseBucketModal,
    ]
  );

  const openBucketModal = useCallback(() => {
    setIsBucketModalVisible(true);
  }, []);
  const closeBucketModal = useCallback(() => {
    setIsBucketModalVisible(false);
    setSelectedBucket({ index: -1, purpose: "" });
  }, []);

  const openDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(false);
    setSelectedBucket({ index: -1, purpose: "" });
  }, []);

  const openReturnModal = useCallback(() => {
    setIsReturnModalVisible(true);
  }, []);
  const closeReturnModal = useCallback(() => {
    setIsReturnModalVisible(false);
    setSelectedBucket({ index: -1, purpose: "" });
  }, []);

  const handleSelectBucket = useCallback((index: number, purpose: "DELETE" | "EDIT" | "PURCHASE" | "RETURNS") => {
    setSelectedBucket({ index: index, purpose: purpose });
  }, []);

  const deleteBucket = useCallback(async () => {
    try {
      await deleteBucketApi(bucketData[selectedBucket.index].id).unwrap();
      toastHelper("success", "Bucket Deleted!");
      closeDeleteModal();
    } catch {
      //poass
    }
  }, [bucketData, selectedBucket.index, deleteBucketApi, closeDeleteModal]);

  const debitDateOptions = useMemo(() => {
    if (selectedBucket.index === -1) return [];
    if (bucketData.length >= selectedBucket.index) return [];

    return bucketData[selectedBucket.index].dates.map((val) => ({ name: val, value: val }));
  }, [bucketData, selectedBucket.index]);

  useEffect(() => {
    if (!portfolioAmount || selectedBucket.index === -1) return;
    const numPortfolioAmt = parseFloat(portfolioAmount);
    const schemeList = bucketData[selectedBucket.index].bucket_schemes;

    for (let i = 0; i < schemeList.length; i++) {
      const { allocation_perc } = schemeList[i];
      const percentAmount = Math.floor(numPortfolioAmt * allocation_perc) / 100;
      setValue(`scheme_list.${i}.amount`, percentAmount);
    }
  }, [portfolioAmount, setValue, bucketData, selectedBucket.index]);

  useEffect(() => {
    if (selectedBucket.index === -1 || !selectedBucket.purpose) return;

    if (selectedBucket.purpose === "DELETE") openDeleteModal();
    else if (selectedBucket.purpose === "EDIT") openBucketModal();
    else if (selectedBucket.purpose === "RETURN") openReturnModal();
    else if (selectedBucket.purpose === "PURCHASE") openPurchaseBucketModal();
    //
  }, [selectedBucket, openDeleteModal, openReturnModal, openPurchaseBucketModal, openBucketModal]);

  return (
    <>
      {isParentAModal ? null : (
        <>
          <FlexRow justifyContent="space-between" alignItems="center">
            <Typography size="3" weight="medium">
              Bucket
            </Typography>
            <Button variant="soft" title="Create New" onPress={openBucketModal} />
          </FlexRow>
          <Padding height={16} />
        </>
      )}
      {isGettingBucket ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200, flexGrow: 1 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {!isGettingBucket && bucketData.length === 0 ? <EmptyResult style={{ minHeight: 200 }} /> : null}

      {!isGettingBucket && bucketData.length !== 0 ? (
        <BucketList data={bucketData} selectBucket={handleSelectBucket} allowPurchase={isParentAModal} />
      ) : null}

      <BucketForm
        closeModal={closeBucketModal}
        isModalVisible={isBucketModalVisible}
        bucketData={
          selectedBucket.index !== -1 && selectedBucket.purpose === "EDIT" ? bucketData[selectedBucket.index] : null
        }
      />

      <CustomModal
        minWidth={650}
        heightPercent={70}
        title="Portfolio Returns"
        closeModal={closeReturnModal}
        isModalVisible={isReturnModalVisible}
      >
        <BucketReturn data={selectedBucket.index === -1 ? [] : bucketData[selectedBucket.index].bucket_schemes || []} />
      </CustomModal>

      <CustomModal
        footerTitle="Delete"
        title="Confirm Delete"
        onConfirm={deleteBucket}
        closeModal={closeDeleteModal}
        isModalVisible={isDeleteModalVisible}
        primaryBtnProps={{
          color: "danger",
          disabled: isDeletingBucket,
          loading: isDeletingBucket,
        }}
      >
        <Typography>Are you sure you want to delete the selected bucket?</Typography>
      </CustomModal>

      <CustomModal
        minWidth={650}
        heightPercent={70}
        title="Add to Cart"
        footerTitle="Submit"
        closeModal={closePurchaseBucketModal}
        onConfirm={handleSubmit(onBucketPurchase)}
        isModalVisible={isPurchaseBucketModalVisible}
        primaryBtnProps={{
          disabled: isPostingBucketPurchase,
          loading: isPostingBucketPurchase,
        }}
      >
        <ControlledInput
          control={control}
          label="Amount"
          key="amount"
          name="amount"
          placeholder="Enter Amount"
          keyboardType="numeric"
          inputMode="numeric"
          rules={{
            required: {
              value: true,
              message: "Please enter amount",
            },
          }}
        />

        <Padding height={16} />

        {selectedBucket.index !== -1 && bucketData[selectedBucket.index].investment_mode === "LUMPSUM" ? null : (
          <>
            <FlexRow style={{ zIndex: 2 }}>
              <ControlledDropDown
                control={control}
                name="start_day"
                label="Start Date"
                placeholder="Select Start Date"
                options={debitDateOptions}
                rules={{
                  required: {
                    value: true,
                    message: "Please select SIP start date",
                  },
                  validate: (value: string) => {
                    if (!value) return "Please select SIP start date";

                    const startDay = getValues("start_day")?.value;
                    const startMonth = getValues("start_month")?.value;
                    const startYear = getValues("start_year");

                    if (!startDay || !startMonth || !startYear) return true;

                    const startDate = moment({
                      year: Number(startYear),
                      month: Number(startMonth),
                      date: Number(startDay),
                    });

                    if (!startDate.isValid()) return "Start date is invalid";

                    const minStartDate = moment().startOf("day").add(4, "days");

                    if (startDate.isBefore(minStartDate)) return "Start date must be at least 4 days from today";

                    return true;
                  },
                }}
              />
              <Padding width={8} />
              <ControlledDropDown
                control={control}
                name="start_month"
                label="Start Month"
                placeholder="Select Start Month"
                options={monthOptions}
                rules={{
                  required: {
                    value: true,
                    message: "Please select SIP start month",
                  },
                }}
              />
              <Padding width={8} />
              <ControlledInput
                control={control}
                name="start_year"
                label="Start Year"
                placeholder="Enter Start Year"
                rules={{
                  required: {
                    value: true,
                    message: "Please enter SIP start year",
                  },
                }}
              />
            </FlexRow>

            <Padding height={16} />

            <ControlledDropDown
              control={control}
              label="SIP Duration"
              name="sip_duration"
              placeholder="Select Duration"
              options={monthlySipDurationOptions}
              rules={{
                required: {
                  value: true,
                  message: "Please select duration",
                },
              }}
            />
            <Padding height={16} />
          </>
        )}

        {(selectedBucket.index === -1 ? [] : bucketData[selectedBucket.index].bucket_schemes).map((val, index) => (
          <View key={index}>
            <CustomCard style={{ backgroundColor: themeColor.gray[2] }}>
              <Typography size="3" weight="medium">
                {val.scheme.name}
              </Typography>
              <Padding height={16} />

              <ControlledInput
                disabled
                control={control}
                label={`Amount (${val.allocation_perc}%)`}
                keyboardType="numeric"
                inputMode="numeric"
                placeholder="Enter Investment Amount"
                name={`scheme_list.${index}.amount`}
                subtitleContent={
                  selectedBucket.index === -1 ? null : (
                    <Typography size="1" color={themeColor.gray[10]}>
                      Minimum amount:{" "}
                      {convertCurrencyToString(
                        val.investment_mode === "SIP" ? val.scheme.sip["MONTHLY"].min_amt : val.scheme.purchase.min_amt
                      )}
                    </Typography>
                  )
                }
                rules={{
                  required: {
                    value: false,
                    message: "Please enter investment amount",
                  },
                  validate: (v: string) => {
                    if (!v || !portfolioAmount) return true;

                    const minAmount =
                      val.investment_mode === "SIP" ? val.scheme.sip["MONTHLY"].min_amt : val.scheme.purchase.min_amt;
                    const percent = parseFloat(val.allocation_perc);
                    const totalAmt = parseFloat(portfolioAmount);

                    if (isNaN(totalAmt)) return "Total portfolio amount is not valid";

                    const currentAmt = (totalAmt * percent) / 100;

                    if (currentAmt < minAmount) {
                      const minAmountStr = convertCurrencyToString(minAmount);
                      return `Minimum required: ${minAmountStr} | ${percent}% of ${convertCurrencyToString(totalAmt)} = ${convertCurrencyToString(currentAmt)}`;
                    }

                    return true;
                  },
                }}
              />
            </CustomCard>
            <Padding height={16} />
          </View>
        ))}
      </CustomModal>
    </>
  );
}

export default React.memo(BucketContainer);
