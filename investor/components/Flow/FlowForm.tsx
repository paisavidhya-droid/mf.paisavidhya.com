import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import moment from "moment";
import { useForm } from "react-hook-form";

import { numberRegex, upiIdRegex } from "@niveshstar/constant";
import {
  ThemeContext,
  useLazyGetPaymentByIdWithTokenQuery,
  usePostCartOrderWithTokenMutation,
  usePostTransactionOtpWithTokenMutation,
} from "@niveshstar/context";
import { useNavigation, useTimer } from "@niveshstar/hook";
import {
  Button,
  Column,
  ControlledCheckbox,
  ControlledDropDown,
  ControlledInput,
  ControlledRadio,
  CustomCard,
  CustomModal,
  Divider,
  dropDownValueType,
  FlexRow,
  Padding,
  Typography,
} from "@niveshstar/ui";
import { convertCurrencyToString, getTimeLeftString, renderPaymentWebsite, toastHelper } from "@niveshstar/utils";

interface PropsType {
  cartData: any;
  bankOptions: dropDownValueType[];
}

const baseDefaultValues = {
  bank: { name: "", value: null },
  payment_mode: { name: "", value: "" },
  mandate: { name: "", value: "" },
  otp: "",
  otp_id: "",
  new_upi: "",
  mobile: "",
  email: "",
};

const defaultOrderData = {
  data: {
    payment_id: null,
    html: null,
    order_summary: [],
    total_amount: 0,
    payment_mode: null,
  },
};

type IFormData = typeof baseDefaultValues & { schemes: Record<string, boolean> };

export default function FlowForm(props: PropsType) {
  const { cartData, bankOptions } = props;

  const { params } = useNavigation();
  const { navigator } = useNavigation();
  const { themeColor } = useContext(ThemeContext);

  const { timeLeft, resetTimer } = useTimer(0);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [isTimerModalVisible, setIsTimerModalVisible] = useState(false);
  const [isOrderSummaryModalVisible, setIsOrderSummaryModalVisible] = useState(false);

  const [getPaymentByIdApi] = useLazyGetPaymentByIdWithTokenQuery();
  const [postTransactionOtpApi, { isLoading: isPostingTransactionOtp }] = usePostTransactionOtpWithTokenMutation();
  const [postCartOrderApi, { isLoading: isPostingCartOrder, data: orderData = defaultOrderData }] =
    usePostCartOrderWithTokenMutation();

  const cartDataDefaultValues: any = useMemo(() => {
    const tmp = {};
    cartData.forEach((val: any) => {
      tmp[val.id] = true;
    });
    return tmp;
  }, [cartData]);

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      ...baseDefaultValues,
      schemes: {
        ...cartDataDefaultValues,
      },
    },
    reValidateMode: "onSubmit",
  });

  const otpEmail = watch("email");
  const otpMobile = watch("mobile");
  const selectedBank = watch("bank");
  const selectedPaymentMode = watch("payment_mode");

  const isStartDateExpired = useMemo(() => {
    const minStartDate = moment().startOf("day").add(4, "days");

    return cartData?.some((val: any) => {
      if (!val.start_date) return false;
      const startDate = moment(val.start_date);
      return startDate.isBefore(minStartDate);
    });
  }, [cartData]);

  const openOtpModal = useCallback(() => {
    setIsOtpModalVisible(true);
  }, []);

  const closeOtpModal = useCallback(() => {
    setIsOtpModalVisible(false);
    setValue("otp", "");
    setValue("otp_id", "");
  }, [setValue]);

  const openOrderSummaryModal = useCallback(() => {
    setIsOrderSummaryModalVisible(true);
  }, []);

  const closeOrderSummaryModal = useCallback(() => {
    setIsOrderSummaryModalVisible(false);
  }, []);

  const openTimerModal = useCallback(
    (time: number) => {
      resetTimer(time);
      setIsTimerModalVisible(true);
    },
    [resetTimer]
  );

  const closeTimerModal = useCallback(() => {
    resetTimer(0);
    setIsTimerModalVisible(false);
  }, [resetTimer]);

  const checkPaymentStatus = useCallback(
    async (paymentId: string) => {
      try {
        const res = await getPaymentByIdApi({ accessToken: params.key, id: paymentId }).unwrap();
        if (!res.success) return { success: false };
        if (res.data.status === "AGENCY_PAYMENT_COMPLETE") return { success: true };
        return { success: false };
      } catch {
        return { success: false };
      }
    },
    [getPaymentByIdApi, params]
  );

  const handlePaymentSuccess = useCallback(() => {
    closeTimerModal();
    navigator.navigate("home", "payment-success");
  }, [closeTimerModal, navigator]);

  const pollOrderStatus = useCallback(
    (paymentId: string) => {
      let retryCount = 0;
      const maxRetry = 30;
      const checkInterval = 10 * 1000;
      let intervalId: NodeJS.Timeout | null = null;

      async function checkOrders() {
        retryCount++;

        const res = await checkPaymentStatus(paymentId);

        if (res.success) {
          clearInterval(intervalId!);
          handlePaymentSuccess();
        }

        if (retryCount >= maxRetry) {
          clearInterval(intervalId!);
          closeTimerModal();
        }
      }

      checkOrders();
      intervalId = setInterval(checkOrders, checkInterval);
    },
    [checkPaymentStatus, closeTimerModal, handlePaymentSuccess]
  );

  const onApprove = useCallback(
    async (data: IFormData) => {
      try {
        const payload = {
          cart_ids: [],
        };

        for (const key in data.schemes) {
          if (data.schemes[key] === true) {
            payload.cart_ids.push(key);
          }
        }

        if (payload.cart_ids.length === 0) {
          toastHelper("error", "Please select atleast one order");
          return;
        }

        const res = await postTransactionOtpApi({ accessToken: params.key, ...payload }).unwrap();

        setValue("email", res.data.email);
        setValue("mobile", res.data.mobile);
        setValue("otp_id", res.data.otp_id);

        openOtpModal();
      } catch {
        //do nothing
      }
    },
    [openOtpModal, postTransactionOtpApi, setValue, params]
  );

  const verifyOtp = useCallback(
    async (data: IFormData) => {
      try {
        const payload: any = {
          otp_id: data.otp_id,
          otp: data.otp,
          bank_account_id: data.bank.value.id,
          upi: data.new_upi,
          payment_mode: data.payment_mode.value,
          mandate_id: data.mandate.value,
        };

        await postCartOrderApi({ accessToken: params.key, ...payload }).unwrap();
      } catch {
        //do nothing
      }
    },
    [postCartOrderApi, params]
  );

  const { sipAmount, lumpsumAmount, totalAmount, firstOrderAmount } = useMemo(() => {
    let [sipAmount, lumpsumAmount, firstOrderAmount] = [0, 0, 0];

    for (const val of cartData) {
      if (val.type === "ORDER") lumpsumAmount += val.amount;
      else sipAmount += val.amount;

      if (val.type === "SXP" && val.first_order_today) firstOrderAmount += val.amount;
    }

    return {
      sipAmount: sipAmount,
      lumpsumAmount: lumpsumAmount,
      totalAmount: sipAmount + lumpsumAmount,
      firstOrderAmount: firstOrderAmount,
    };
  }, [cartData]);

  const mandateOptions = useMemo(() => {
    if (!selectedBank.value) return [];

    setValue("mandate", { name: "", value: "" });
    setValue("payment_mode", { name: "", value: "" });

    const tmpMandateOptions = selectedBank.value.mandate
      .filter((val: any) => val.amount >= totalAmount)
      .map((val: any) => ({
        name: `${val.type} - ${convertCurrencyToString(val.amount)}`,
        value: val.id,
      }));

    return tmpMandateOptions;
  }, [selectedBank, totalAmount, setValue]);

  const availablePaymentOptions = useMemo(() => {
    if (!selectedBank.value) return [];

    const tmpOptions = [];

    if (lumpsumAmount !== 0 || firstOrderAmount !== 0) {
      tmpOptions.push(
        { name: "Internet Banking", value: "NETBANKING", disabled: totalAmount < 100 },
        { name: "UPI", value: "UPI", disabled: totalAmount > 100000 }
      );
    }

    if (sipAmount !== 0) {
      tmpOptions.push({ name: "Autopay", value: "MANDATE", disabled: mandateOptions.length === 0 });
    }

    return tmpOptions;
  }, [selectedBank.value, totalAmount, mandateOptions, sipAmount, lumpsumAmount, firstOrderAmount]);

  const openNetBankingPage = useCallback(() => {
    renderPaymentWebsite(orderData.data.html);
  }, [orderData]);

  const proceedToPayment = useCallback(() => {
    closeOrderSummaryModal();

    if (!orderData.data.payment_id) {
      navigator.navigate("home", "payment-success");
      return;
    }

    switch (orderData.data.payment_mode) {
      case "NETBANKING":
      case "UPI":
        openTimerModal(300);
        pollOrderStatus(orderData.data.payment_id);
        break;
      case "MANDATE":
        break;
    }
  }, [orderData, openTimerModal, pollOrderStatus, closeOrderSummaryModal, navigator]);

  useEffect(() => {
    if (!orderData.data.payment_mode) return;
    reset();
    closeOtpModal();
    openOrderSummaryModal();
  }, [orderData, openOrderSummaryModal, closeOtpModal, reset]);

  return (
    <CustomCard style={{ flexGrow: 1, backgroundColor: themeColor.gray[3] }}>
      <FlexRow>
        <Column col={16}>
          {cartData.map((val: any, i: number) => (
            <React.Fragment key={i}>
              <FlexRow alignItems="center" style={{ marginBottom: 24 }}>
                <ControlledCheckbox control={control} name={`schemes.${val.id}`} label="" />
                <Padding width={16} />
                <View>
                  <Typography>
                    {val.scheme ? val.scheme.name : val.src_scheme.name} | {convertCurrencyToString(val.amount)}
                  </Typography>
                  <Typography color={themeColor.gray[10]}>
                    {val.sxp_type || val.order_type} {val.freq ? ` | ${val.freq}` : ""}
                    {val.start_date ? ` | Start Date: ${moment(val.start_date).format("DD MMM YYYY")}` : ""}
                    {val.end_date ? ` | End Date: ${moment(val.end_date).format("DD MMM YYYY")}` : ""}
                    {val.ninstallments ? ` | Inst: ${val.ninstallments}` : ""}
                    {val.type === "SXP" ? ` | First order today: ${val.first_order_today}` : ""}
                  </Typography>
                  {val.start_date && moment(val.start_date).isBefore(moment().startOf("day").add(4, "days")) ? (
                    <Typography weight="bold" color={themeColor.red[9]}>
                      Start Date Expired
                    </Typography>
                  ) : null}
                </View>
              </FlexRow>
            </React.Fragment>
          ))}
        </Column>
        <Column col={8}>
          <FlexRow>
            <Typography style={{ flex: 1 }} color={themeColor.gray[11]}>
              Lumpsum Amt
            </Typography>
            <Typography color={themeColor.gray[11]}>{convertCurrencyToString(lumpsumAmount)}</Typography>
          </FlexRow>
          <Padding height={16} />
          <FlexRow>
            <Typography style={{ flex: 1 }} color={themeColor.gray[11]}>
              SIP Amt
            </Typography>
            <Typography color={themeColor.gray[11]}>{convertCurrencyToString(sipAmount)}</Typography>
          </FlexRow>

          <Padding height={16} />
          <Divider />
          <Padding height={16} />

          <FlexRow>
            <Typography style={{ flex: 1 }} size="4" type="heading" weight="bold">
              Total
            </Typography>
            <Typography size="4" type="heading" weight="bold">
              {convertCurrencyToString(totalAmount)}
            </Typography>
          </FlexRow>

          <Padding height={32} />

          <ControlledDropDown
            name="bank"
            control={control}
            options={bankOptions}
            label="Select Bank Account"
            placeholder="Choose your bank"
            disabled={cartData.length === 0 || isStartDateExpired}
            rules={{
              required: {
                value: true,
                message: "Please select bank",
              },
            }}
          />

          {selectedBank.value ? (
            <>
              <Padding height={16} />
              <ControlledRadio
                control={control}
                name="payment_mode"
                label="Select Payment Mode"
                options={availablePaymentOptions}
                rules={{
                  required: {
                    value: true,
                    message: "Please select a payment mode",
                  },
                }}
              />
            </>
          ) : null}

          {selectedPaymentMode.value === "UPI" ? (
            <>
              <Padding height={16} />
              <ControlledInput
                name="new_upi"
                control={control}
                label="Add new UPI"
                placeholder="Add new UPI"
                rules={{
                  required: {
                    value: true,
                    message: "Please enter UPI",
                  },
                  pattern: {
                    value: upiIdRegex,
                    message: "Invalid UPI ID format",
                  },
                }}
              />
            </>
          ) : null}

          {sipAmount > 0 && selectedBank.value && mandateOptions.length === 0 ? (
            <>
              <Padding height={8} />
              <Typography color={themeColor.red[9]}>
                Autopay is required for SIP/SXP orders. No eligible mandate found for the selected bank. Please select a
                different bank or set up a mandate.
              </Typography>
            </>
          ) : null}

          {(sipAmount > 0 && mandateOptions.length !== 0) ||
          (selectedPaymentMode.value === "MANDATE" && mandateOptions.length !== 0) ? (
            <>
              <Padding height={16} />
              <ControlledDropDown
                name="mandate"
                control={control}
                label="Select Mandate"
                options={mandateOptions}
                placeholder="Select Mandate"
                rules={{
                  required: {
                    value: true,
                    message: "Please select mandate",
                  },
                }}
              />
            </>
          ) : null}

          <Padding height={16} />

          <Button
            color="success"
            title="Approve"
            onPress={handleSubmit(onApprove)}
            loading={isPostingTransactionOtp}
            disabled={
              isPostingTransactionOtp ||
              (sipAmount > 0 && mandateOptions.length === 0) ||
              cartData.length === 0 ||
              isStartDateExpired
            }
          />

          {isStartDateExpired ? (
            <>
              <Padding height={16} />
              <Typography size="1" color={themeColor.red[9]}>
                Some orders have a start date that is not at least 4 days from today. Please update them before
                proceeding.
              </Typography>
            </>
          ) : null}
        </Column>
      </FlexRow>

      <CustomModal
        footerTitle="Verify"
        title="OTP Verification"
        closeModal={closeOtpModal}
        isModalVisible={isOtpModalVisible}
        onConfirm={handleSubmit(verifyOtp)}
        primaryBtnProps={{
          disabled: isPostingCartOrder,
          loading: isPostingCartOrder,
        }}
      >
        <Typography>
          OTP has been sent to {otpMobile} / {otpEmail}
        </Typography>
        <Padding height={16} />
        <ControlledInput
          name="otp"
          label="OTP"
          control={control}
          inputMode="numeric"
          placeholder="Enter OTP"
          keyboardType="number-pad"
          rules={{
            required: {
              value: true,
              message: "Please enter a valid 4 digit number",
            },
            pattern: {
              value: numberRegex,
              message: "Please enter a valid 4 digit number",
            },
            minLength: {
              value: 4,
              message: "Please enter a valid 4 digit number",
            },
            maxLength: {
              value: 4,
              message: "Please enter a valid 4 digit number",
            },
          }}
        />
      </CustomModal>

      <CustomModal
        minWidth={400}
        heightPercent={80}
        footerTitle="Proceed"
        closeModal={() => {}}
        title="Order Summary"
        onConfirm={proceedToPayment}
        secondaryBtnProps={{ disabled: true }}
        isModalVisible={isOrderSummaryModalVisible}
        primaryBtnProps={{ disabled: !orderData?.data?.payment_mode }}
      >
        {orderData.data.order_summary.length === 0 ? (
          <>
            <Padding height={16} />
            <Typography color={themeColor.red[9]} size="6" align="center" weight="bold">
              Something Went Wrong!
            </Typography>
            <Padding height={16} />
            <Typography align="center" size="3">
              Please reach out to your advisor
            </Typography>
          </>
        ) : (
          <>
            {orderData.data.order_summary.map((val: any) => (
              <React.Fragment key={val.scheme}>
                <FlexRow colGap={16} rowGap={16}>
                  <Column col={16}>
                    <Typography style={{ flex: 1 }}>{val.scheme}</Typography>
                    <Padding height={8} />
                    <Typography weight="bold">{convertCurrencyToString(val.amount)}</Typography>
                  </Column>
                  <Column col={8}>
                    <Typography
                      weight="bold"
                      style={{ flex: 1 }}
                      color={val.success ? themeColor.green[9] : themeColor.red[9]}
                    >
                      {val.message}
                    </Typography>
                  </Column>
                </FlexRow>
                <Padding height={16} />
                <Divider />
                <Padding height={16} />
              </React.Fragment>
            ))}
            <Typography size="3" style={{ flex: 1 }}>
              Total Amount to be paid right now: {convertCurrencyToString(orderData.data.total_amount)}
            </Typography>
          </>
        )}
        <Padding height={24} />
      </CustomModal>

      <CustomModal
        minWidth={400}
        heightPercent={70}
        closeModal={() => {}}
        title="Waiting for Payment"
        isModalVisible={isTimerModalVisible}
        secondaryBtnProps={{ disabled: true }}
      >
        {orderData.data?.html ? (
          <>
            <Typography align="center">
              Please click the button below. It will redirect you to the net banking page in a new tab.
            </Typography>
            <Padding height={16} />
            <FlexRow justifyContent="center">
              <Button
                variant="soft"
                title="Complete Payment"
                onPress={openNetBankingPage}
                disabled={!orderData.data?.html}
              />
            </FlexRow>
            <Padding height={24} />
            <Divider />
            <Padding height={24} />
          </>
        ) : null}
        <Typography align="center">Please complete the payment in the given time frame</Typography>
        <Padding height={16} />
        <Typography align="center" size="3" weight="medium">
          Time remaining: {getTimeLeftString(timeLeft)}
        </Typography>
      </CustomModal>
    </CustomCard>
  );
}
