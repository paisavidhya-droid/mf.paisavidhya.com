import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { monthOptions } from "@niveshstar/constant";
import {
  RootStateType,
  ThemeContext,
  useLazyGetSchemeByIdQuery,
  usePatchCartMutation,
  usePostCartMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { convertCurrencyToString, getSipDurationOptions, toastHelper } from "@niveshstar/utils";

import Button from "../../Button";
import Column from "../../Column";
import ControlledCheckbox from "../../ControlledCheckbox";
import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import CustomModal from "../../CustomModal";
import DatePicker from "../../DatePicker";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import SchemeDropDown from "../../SchemeDropDown";
import Typography from "../../Typography";

interface PropsType {
  schemeId?: string;
  isModalVisible: boolean;
  closeModal: () => void;
  cartData?: any;
}

const currentMonth = monthOptions.filter((val) => val.value === moment().add(4, "days").month());

const defaultValues = {
  scheme: { name: "", value: null },
  investing_details: { name: "ORDER", value: "ORDER" },
  sip_amount: "",
  lumpsum_amount: "",
  start_day: { name: "", value: "" },
  start_month: { name: currentMonth[0].name, value: currentMonth[0].value },
  start_year: moment().add(4, "days").year().toString(),
  sip_duration: { name: "", value: "" },
  freq: { name: "", value: "" },
  first_order_today: false,
  end_date: "",
};

function InvestForm(props: PropsType) {
  const { schemeId, isModalVisible, closeModal, cartData = null } = props;
  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const hasPrefilledRef = useRef(false);

  const { control, handleSubmit, watch, setValue, reset, getValues } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const sipFreq = watch("freq");
  const selectedScheme = watch("scheme");
  const investingDetails = watch("investing_details");

  const [postCartApi, { isLoading: isPostingCart }] = usePostCartMutation();
  const [patchCartApi, { isLoading: isPatchingCart }] = usePatchCartMutation();
  const [getSchemeByIdApi, { isLoading: isGettingSchemeById }] = useLazyGetSchemeByIdQuery();

  const { minPurchaseValue, sipAllowed, purchaseAllowed, freqOptions } = useMemo(() => {
    let purchaseAllowed = false;
    let minPurchaseValue = -1;
    let sipAllowed = false;
    let freqOptions: { name: string; value: string }[] = [];

    if (selectedScheme.value) {
      const { purchase, sip } = selectedScheme.value;

      purchaseAllowed = purchase?.flag ?? false;
      minPurchaseValue = purchase?.min_amt ?? -1;

      const activeFrequencies = Object.entries(sip)
        .filter(([, val]: [string, any]) => val.flag === true)
        .map(([key]) => key);

      sipAllowed = activeFrequencies.length > 0;
      freqOptions = activeFrequencies.map((key) => ({ name: key, value: key }));
    }

    return {
      minPurchaseValue,
      sipAllowed,
      purchaseAllowed,
      freqOptions,
    };
  }, [selectedScheme]);

  const { minSipValue, minSipInstallments, debitDateOptions, sipDurationOptions, firstOrderAllowed } = useMemo(() => {
    let minSipValue = -1;
    let minSipInstallments = -1;
    let firstOrderAllowed = false;
    let debitDateOptions: { name: string; value: number }[] = [];
    // let debitDaysOptions: { name: string; value: number }[] = [];
    let sipDurationOptions: { name: string; value: number }[] = [];

    if (selectedScheme.value && sipFreq.value) {
      minSipValue = selectedScheme.value.sip[sipFreq.value].min_amt;

      // debitDaysOptions = selectedScheme.value.sip[sipFreq.value].days.map((val: number) => ({
      //   name: val,
      //   value: weekdayNames[val],
      // }));

      debitDateOptions = selectedScheme.value.sip[sipFreq.value].dates.map((val: number) => ({
        name: val,
        value: val,
      }));

      minSipInstallments = selectedScheme.value.sip[sipFreq.value].min_installement;
      firstOrderAllowed = selectedScheme.value.sip[sipFreq.value].first_order_today_flag;
      sipDurationOptions = getSipDurationOptions(sipFreq.value);
    }

    return {
      minSipValue,
      debitDateOptions,
      // debitDaysOptions,
      sipDurationOptions,
      minSipInstallments,
      firstOrderAllowed,
    };
  }, [selectedScheme, sipFreq.value]);

  const handleCloseModal = useCallback(() => {
    hasPrefilledRef.current = false;
    closeModal();
    reset();
  }, [closeModal, reset]);

  const handleConfirm = useCallback(
    async (data: typeof defaultValues) => {
      try {
        let startDate, ninstallments, orderType, sxpType, amount, freq, firstOrderToday, endDate;

        if (data.investing_details.value === "ORDER") {
          amount = parseFloat(data.lumpsum_amount);
          orderType = "PURCHASE";
        }

        if (data.investing_details.value === "SXP") {
          amount = parseFloat(data.sip_amount);
          sxpType = "SIP";
          freq = data.freq.value;
          firstOrderToday = data.first_order_today;

          startDate = moment({
            year: Number(data.start_year),
            month: Number(data.start_month.value),
            date: Number(data.start_day.value),
          });

          startDate = startDate.toISOString();

          if (data.freq.value !== "DAILY") {
            ninstallments = data.sip_duration.value;
          }

          if (data.freq.value === "DAILY") {
            endDate = moment(data.end_date, ["YYYY-MM-DD", "D/M/YYYY"], true);
          }
        }

        const investorId = authDetail.userType === "investor" ? undefined : params.investorId;

        const payload = {
          type: data.investing_details.value,
          scheme_id: selectedScheme.value.id,
          amount: amount,
          order_type: orderType,
          sxp_type: sxpType,
          start_date: startDate,
          ninstallments: ninstallments,
          first_order_today: firstOrderToday,
          freq: freq,
          end_date: endDate,
        };

        if (cartData) {
          await patchCartApi({ id: cartData.id, payload: payload }).unwrap();
          setTimeout(() => {
            toastHelper("success", "Updated");
          }, 300);
        } else {
          await postCartApi({ investorId: investorId, payload: payload }).unwrap();
          setTimeout(() => {
            toastHelper("success", "Added to cart");
          }, 300);
        }

        handleCloseModal();
      } catch {
        //do nothing
      }
    },
    [postCartApi, patchCartApi, cartData, handleCloseModal, selectedScheme, params, authDetail]
  );

  const getSchemeById = useCallback(
    async (id: string) => {
      try {
        const res = await getSchemeByIdApi(id).unwrap();
        setValue("scheme", { name: res.data.name, value: res.data });
      } catch {
        //pass
      }
    },
    [getSchemeByIdApi, setValue]
  );

  useEffect(() => {
    if (!schemeId) return;
    getSchemeById(schemeId);
  }, [schemeId, getSchemeById, isModalVisible]);

  useEffect(() => {
    if (hasPrefilledRef.current) return;
    if (!cartData || freqOptions.length === 0) return;

    if (cartData.type === "ORDER") {
      setValue("lumpsum_amount", cartData.amount);
      setValue("investing_details", { name: "ORDER", value: "ORDER" });
    } else {
      setValue("sip_amount", cartData.amount);
      setValue("investing_details", { name: "SXP", value: "SXP" });
    }

    const filterFrq = freqOptions.filter((val) => val.value === cartData.freq);
    if (filterFrq.length) setValue("freq", filterFrq[0]);

    //
  }, [cartData, setValue, freqOptions]);

  useMemo(() => {
    if (hasPrefilledRef.current) return;
    if (!cartData || debitDateOptions.length === 0 || sipDurationOptions.length === 0) return;

    setValue("end_date", cartData.end_date ? moment(cartData.end_date).format("YYYY-MM-DD") : "");
    setValue("first_order_today", cartData.first_order_today);

    const startDay = moment(cartData.start_date).date();
    const startMonth = moment(cartData.start_date).month();
    const startYear = moment(cartData.start_date).year().toString();

    const filterDebitDate = debitDateOptions.filter((val) => val.value === startDay);
    if (filterDebitDate.length) setValue("start_day", filterDebitDate[0] as any);

    const filterStartMonth = monthOptions.filter((val) => val.value === startMonth);
    if (filterStartMonth.length) setValue("start_month", filterStartMonth[0] as any);

    setValue("start_year", startYear);

    const filterSipDuration = sipDurationOptions.filter((val) => val.value === cartData.ninstallments);
    if (filterSipDuration.length) setValue("sip_duration", filterSipDuration[0] as any);

    hasPrefilledRef.current = true;
    //
  }, [cartData, setValue, debitDateOptions, sipDurationOptions]);

  return (
    <CustomModal
      title={cartData ? "Update" : "Invest"}
      minWidth={500}
      maxWidth={500}
      heightPercent={70}
      closeModal={handleCloseModal}
      isModalVisible={isModalVisible}
      onConfirm={handleSubmit(handleConfirm)}
      footerTitle={cartData ? "Update" : "Add to Cart"}
      primaryBtnProps={{
        disabled: isPostingCart || isPatchingCart || isGettingSchemeById,
        loading: isPostingCart || isPatchingCart,
      }}
    >
      <View style={{ minHeight: 400 }}>
        {isGettingSchemeById ? (
          <FlexRow justifyContent="center" alignItems="center" style={{ flexGrow: 1 }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </FlexRow>
        ) : (
          <>
            <FlexRow justifyContent="space-between" offset={4}>
              <Column col={12} offset={4}>
                <Button
                  title="One Time"
                  disabled={!purchaseAllowed}
                  variant={investingDetails.value === "ORDER" ? "soft" : "outline"}
                  onPress={() => setValue("investing_details", { name: "ORDER", value: "ORDER" })}
                />
              </Column>

              <Column col={12} offset={4}>
                <Button
                  title="SIP"
                  disabled={!sipAllowed}
                  variant={investingDetails.value === "SXP" ? "soft" : "outline"}
                  onPress={() => setValue("investing_details", { name: "SXP", value: "SXP" })}
                />
              </Column>
            </FlexRow>
            <Padding height={16} />
            {schemeId ? (
              <ControlledInput
                disabled
                multiline
                label="Scheme"
                control={control}
                name="scheme"
                value={selectedScheme?.name}
                rules={{
                  required: {
                    value: true,
                    message: "Please select a scheme",
                  },
                }}
              />
            ) : (
              <SchemeDropDown
                type="PURCHASE"
                control={control}
                name="scheme"
                rules={{
                  required: {
                    value: true,
                    message: "Please select a scheme",
                  },
                }}
              />
            )}

            {investingDetails.value === "ORDER" ? null : (
              <>
                <Padding height={16} />
                <ControlledDropDown
                  control={control}
                  name="freq"
                  label="SIP Frequency"
                  placeholder="Select SIP Frequency"
                  options={freqOptions}
                  disabled={!selectedScheme.value}
                  rules={{
                    required: {
                      value: true,
                      message: "Please select SIP Frequency",
                    },
                  }}
                />

                <Padding height={16} />
                <FlexRow style={{ zIndex: 2 }}>
                  <ControlledDropDown
                    control={control}
                    name="start_day"
                    label="Start Date"
                    disabled={!sipFreq.value}
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
                    disabled={!sipFreq.value}
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
                    disabled={!sipFreq.value}
                    placeholder="Enter Start Year"
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter SIP start year",
                      },
                    }}
                  />
                </FlexRow>
                <Padding height={8} />
                <Typography size="1" color={themeColor.gray[10]}>
                  Start date must be at least 4 days from the date at the time of placing order.
                </Typography>
                <Padding height={8} />

                {sipFreq.value === "DAILY" ? (
                  <>
                    <Padding height={16} />
                    <DatePicker
                      control={control}
                      name="end_date"
                      label="End Date"
                      minimumDate={new Date()}
                      placeholder="DD/MM/YYYY"
                      rules={{
                        required: {
                          value: true,
                          message: "Please enter an end date",
                        },
                        validate: (value: string) => {
                          if (!value) return "Please enter an end date";

                          const selectedEndDate = moment(value, ["YYYY-MM-DD", "D/M/YYYY"], true);
                          if (!selectedEndDate.isValid()) return "Please enter a valid end date";

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

                          if (!selectedEndDate.isAfter(startDate)) return "End date must be after start date";

                          return true;
                        },
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Padding height={16} />
                    <ControlledDropDown
                      control={control}
                      name="sip_duration"
                      label="SIP Duration"
                      disabled={!sipFreq.value}
                      placeholder="Select SIP Duration"
                      options={sipDurationOptions}
                      subtitleContent={
                        minSipInstallments == -1 ? null : (
                          <Typography size="1" color={themeColor.gray[9]} weight="light" align="right">
                            Minimum Installment: {minSipInstallments}
                          </Typography>
                        )
                      }
                      rules={{
                        required: {
                          value: true,
                          message: "Please select SIP duration",
                        },
                        validate: (v: { name: string; value: number }) => {
                          if (v.value < minSipInstallments) return `Please select a value above ${minSipInstallments}`;
                          return true;
                        },
                      }}
                    />
                  </>
                )}
              </>
            )}

            <Padding height={16} />
            {investingDetails.value === "SXP" ? (
              <ControlledInput
                key="sip_amount"
                control={control}
                name="sip_amount"
                label="SIP Amount (in Rs.)"
                placeholder="Enter SIP Amount (in Rs.)"
                keyboardType="numeric"
                inputMode="numeric"
                disabled={!sipFreq.value}
                subtitleContent={
                  minSipValue == -1 ? null : (
                    <Typography size="1" color={themeColor.gray[9]} weight="light" align="right">
                      Minimum Amt: {convertCurrencyToString(minSipValue)}
                    </Typography>
                  )
                }
                rules={{
                  required: {
                    value: true,
                    message: "Please enter installment amount",
                  },
                  validate: (v: string) => {
                    if (parseInt(v) < minSipValue)
                      return `Please enter a value above ${convertCurrencyToString(minSipValue)}`;
                    return true;
                  },
                }}
              />
            ) : (
              <ControlledInput
                control={control}
                key="lumpsum_amount"
                name="lumpsum_amount"
                label="Lumpsum Amount (in Rs.)"
                placeholder="Enter Lumpsum Amount (in Rs.)"
                keyboardType="numeric"
                inputMode="numeric"
                subtitleContent={
                  minPurchaseValue == -1 ? null : (
                    <Typography size="1" color={themeColor.gray[9]} weight="light" align="right">
                      Minimum Amt: {convertCurrencyToString(minPurchaseValue)}
                    </Typography>
                  )
                }
                rules={{
                  required: {
                    value: true,
                    message: "Please enter amount",
                  },
                  validate: (v: string) => {
                    if (parseInt(v) < minPurchaseValue)
                      return `Please enter a value above ${convertCurrencyToString(minPurchaseValue)}`;
                    return true;
                  },
                }}
              />
            )}

            {investingDetails.value === "ORDER" ? null : (
              <>
                <Padding height={16} />
                <ControlledCheckbox
                  control={control}
                  name="first_order_today"
                  label="First Order Today"
                  disabled={!sipFreq.value || !firstOrderAllowed}
                />
              </>
            )}
          </>
        )}
      </View>
    </CustomModal>
  );
}

export default React.memo(InvestForm);
