import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";
import { useForm } from "react-hook-form";
import { Menu, MenuItem } from "react-native-material-menu";
import { useSelector } from "react-redux";

import { numberRegex, sipCancelReasonOptions } from "@niveshstar/constant";
import {
  RootStateType,
  ScreenContext,
  ThemeContext,
  useGetSxpListQuery,
  usePostCancelSxpMutation,
  usePostCancelSxpOtpMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { convertCurrencyToString } from "@niveshstar/utils";

import Button from "../../Button";
import Column from "../../Column";
import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import CustomCard from "../../CustomCard";
import CustomModal from "../../CustomModal";
import EmptyResult from "../../EmptyResult";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

const defaultValues = {
  reason: { name: "", value: "" },
  reason_msg: "",
  otp: "",
  otp_id: "",
  mobile: "",
  email: "",
};

function SipList() {
  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const [selectedSipIndex, setSelectedSipIndex] = useState(-1);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [postCancelSxpApi, { isLoading: isPostintCancelSxp }] = usePostCancelSxpMutation();
  const [postCancelSxpOtpApi, { isLoading: isPostingCancelSxpOtp }] = usePostCancelSxpOtpMutation();

  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const {
    data: sxpData = { list: [], total: 0, limit: 10, page: 1 },
    isLoading: isGettingSxpData,
    isFetching: isFetchingSxpData,
  } = useGetSxpListQuery(
    {
      page: 1,
      limit: 10,
      investorId: authDetail.userType === "partner" ? params?.investorId : undefined,
    },
    {
      skip: authDetail.userType === "partner" && !params?.investorId,
    }
  );

  const otpEmail = watch("email");
  const reason = watch("reason");

  const [isMenuVisible, setIsMenuVisible] = useState(-1);

  const openMenu = useCallback(
    (index: number) => () => {
      setIsMenuVisible(index);
    },
    []
  );
  const closeMenu = useCallback(() => {
    setIsMenuVisible(-1);
  }, []);

  const handleSelectSip = useCallback((index: number) => {
    setSelectedSipIndex(index);
  }, []);

  const openReasonModal = useCallback(() => {
    setIsReasonModalOpen(true);
    closeMenu();
  }, [closeMenu]);
  const closeReasonModal = useCallback(() => {
    setSelectedSipIndex(-1);
    setIsReasonModalOpen(false);
  }, []);

  const openOtpModal = useCallback(() => {
    setIsOtpModalVisible(true);
  }, []);
  const closeOtpModal = useCallback(() => {
    setIsOtpModalVisible(false);
    reset();
  }, [reset]);

  const handleGetOtp = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const currItem = sxpData.list[selectedSipIndex];

        const payload = {
          sxp_id: currItem.id,
          reason: data.reason.value,
          reason_msg: data.reason_msg,
        };

        const res = await postCancelSxpOtpApi(payload).unwrap();

        setValue("email", res.data.email);
        setValue("mobile", res.data.mobile);
        setValue("otp_id", res.data.otp_id);

        openOtpModal();
      } catch {
        //pass
      }
    },
    [openOtpModal, selectedSipIndex, sxpData, postCancelSxpOtpApi, setValue]
  );

  const verifyOtp = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          otp_id: data.otp_id,
          otp: data.otp,
        };

        await postCancelSxpApi(payload).unwrap();

        closeOtpModal();
        closeReasonModal();
      } catch {
        //pass
      }
    },
    [closeOtpModal, closeReasonModal, postCancelSxpApi]
  );

  const getSipDuration = useCallback((ninstallments: number) => {
    const years = ninstallments / 12;
    let res = years.toString() + " Years";
    if (years < 1) res = ninstallments + " Months";
    if (years > 30) res = "Until Cancelled";
    return res;
  }, []);

  useEffect(() => {
    if (selectedSipIndex === -1) return;
    openReasonModal();
  }, [selectedSipIndex, openReasonModal]);

  return (
    <>
      {authDetail.userType === "investor" ? (
        <>
          <Typography size="5" weight="medium">
            SIPs
          </Typography>
          <Padding height={24} />
        </>
      ) : null}

      {isGettingSxpData || (authDetail.userType === "partner" && isFetchingSxpData) ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {!isGettingSxpData && !(authDetail.userType === "partner" && isFetchingSxpData) && sxpData.total === 0 ? (
        <EmptyResult />
      ) : null}

      <FlexRow alignItems="stretch" offset={8} rowGap={16} wrap>
        {sxpData.list.map((val: any, i: number) => (
          <Column col={screenType === "sm" ? 24 : 12} offset={8} key={val.id}>
            <CustomCard style={{ backgroundColor: themeColor.gray[3], flexGrow: 1 }}>
              <FlexRow justifyContent="space-between">
                <Image source={{ uri: val.src_scheme.amc_img_url }} style={styles.img} />
                <Padding width={8} />
                <View style={{ flex: 1 }}>
                  <Typography weight="medium">{val.src_scheme?.name}</Typography>
                  <Padding height={8} />
                  <Typography size="1" color={themeColor.gray[10]}>
                    Freq: {val.freq}
                  </Typography>
                </View>
                {authDetail.userType === "investor" ? (
                  <>
                    <Padding width={16} />
                    <Menu
                      visible={isMenuVisible === i}
                      onRequestClose={closeMenu}
                      style={{
                        ...styles.menuContainer,
                        shadowColor: themeColor.gray["a5"],
                      }}
                      anchor={
                        <Button
                          variant="ghost"
                          color="neutral"
                          onPress={openMenu(i)}
                          icon={<Entypo name="dots-three-vertical" color={themeColor.gray[12]} size={16} />}
                        />
                      }
                    >
                      <View
                        style={[
                          styles.menuContent,
                          {
                            backgroundColor: themeColor.gray[1],
                            borderColor: themeColor.gray[6],
                          },
                        ]}
                      >
                        <MenuItem
                          onPress={() => handleSelectSip(i)}
                          style={{ ...styles.menuItem, borderColor: themeColor.gray[6] }}
                          textStyle={styles.textContainer}
                        >
                          <Typography>Cancel SIP</Typography>
                        </MenuItem>
                      </View>
                    </Menu>
                  </>
                ) : null}
              </FlexRow>
              <Padding height={16} />
              <FlexRow alignItems="flex-end" justifyContent="space-between" style={{ flexGrow: 1 }}>
                <View>
                  <Typography size="1" weight="light">
                    {val.freq === "DAILY" ? "End Date" : "Duration"}
                  </Typography>
                  <Typography size="1" weight="light">
                    {val.freq === "DAILY"
                      ? moment(val.end_date).format("DD MMM YYYY")
                      : getSipDuration(val.ninstallments)}
                  </Typography>
                </View>
                <View>
                  <Typography size="1" weight="light">
                    SIP Amount
                  </Typography>
                  <Typography size="1" weight="light">
                    {convertCurrencyToString(val.amount)}
                  </Typography>
                </View>
                <View>
                  <Typography size="1" weight="light">
                    Next Installment
                  </Typography>
                  <Typography size="1" weight="light">
                    {val.freq === "DAILY"
                      ? "Tomorrow"
                      : moment().add(1, "month").date(val.txn_date).format("DD MMM YYYY")}
                  </Typography>
                </View>
              </FlexRow>
            </CustomCard>
          </Column>
        ))}
      </FlexRow>

      <CustomModal
        heightPercent={70}
        title="Cancel SIP"
        footerTitle="Confirm"
        closeModal={closeReasonModal}
        isModalVisible={isReasonModalOpen}
        onConfirm={handleSubmit(handleGetOtp)}
        primaryBtnProps={{
          disabled: isPostingCancelSxpOtp,
          loading: isPostingCancelSxpOtp,
        }}
      >
        <View style={{ minHeight: 400 }}>
          <ControlledDropDown
            name="reason"
            control={control}
            placeholder="Select Reason"
            options={sipCancelReasonOptions}
            label="Select Reason for Cancellation"
            rules={{
              required: {
                value: true,
                message: "Please select a reason",
              },
            }}
          />
          {reason.value === "OTHERS" ? (
            <>
              <Padding height={16} />
              <ControlledInput
                multiline
                numberOfLines={4}
                label="Reason"
                name="reason_msg"
                control={control}
                placeholder="Reason"
                rules={{
                  required: {
                    value: true,
                    message: "Please enter reason",
                  },
                }}
              />
            </>
          ) : null}
        </View>
      </CustomModal>

      <CustomModal
        footerTitle="Verify"
        title="OTP Verification"
        closeModal={closeOtpModal}
        isModalVisible={isOtpModalVisible}
        onConfirm={handleSubmit(verifyOtp)}
        primaryBtnProps={{
          disabled: isPostintCancelSxp,
          loading: isPostintCancelSxp,
        }}
      >
        <Typography>OTP has been sent to {otpEmail}</Typography>
        <Padding height={20} />
        <ControlledInput
          control={control}
          name="otp"
          placeholder="Enter OTP"
          inputMode="numeric"
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
    </>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    borderRadius: 14,
    shadowOpacity: 1,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    elevation: 6,
    shadowRadius: 6,
  },
  menuContent: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 5,
  },
  menuItem: {
    minHeight: 32,
    height: 32,
  },
  textContainer: {
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  img: {
    width: 40,
    height: 40,
  },
});

export default React.memo(SipList);
