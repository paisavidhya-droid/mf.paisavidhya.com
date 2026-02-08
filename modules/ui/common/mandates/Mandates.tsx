import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext, useGetMandateListQuery, usePostMandateMutation } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import Button from "../../Button";
import CopyToClipboard from "../../CopyToClipboard";
import CustomModal from "../../CustomModal";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import MandateList from "./MandateList";
import NewMandateForm from "./NewMandateForm";

const defaultValues = {
  custom_limit: "",
  bank_account: { name: "", value: "" },
  limit: { name: "", value: "" },
  mandate_type: { name: "", value: "" },
  upi_id: "",
};

function Mandates() {
  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const [isMandateModalVisible, setIsMandateModalVisible] = useState(false);
  const [isMandateApproveModalVisible, setIsMandateApproveModalVisible] = useState(false);

  const authDetail = useSelector((state: RootStateType) => state.auth);

  const investorId = authDetail.userType === "investor" ? authDetail.id : params?.investorId;

  const [postMandateApi, { isLoading: isPostingMandate, data: mandateCreateData = null }] = usePostMandateMutation();
  const { data: mandateData = { list: [], total: 0, limit: 0, page: 1 }, isFetching: isFetchingMandate } =
    useGetMandateListQuery(
      {
        page: 1,
        limit: 10,
        investorId: authDetail.userType === "investor" ? undefined : investorId,
      },
      {
        skip: !investorId,
      }
    );

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const mandateType = watch("mandate_type");

  const openMandateModal = useCallback(() => {
    setIsMandateModalVisible(true);
  }, []);

  const closeMandateModal = useCallback(() => {
    setIsMandateModalVisible(false);
    reset();
  }, [reset]);

  const openMandateApproveModal = useCallback(() => {
    setIsMandateApproveModalVisible(true);
  }, []);

  const closeMandateApproveModal = useCallback(() => {
    setIsMandateApproveModalVisible(false);
  }, []);

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          amount: data.limit.value ? parseFloat(data.limit.value) : parseFloat(data.custom_limit),
          upi_id: data.mandate_type.value === "UPI" ? data.upi_id : undefined,
          bank_account_id: data.bank_account.value,
          type: data.mandate_type.value,
          // frequency: "AS_AND_WHEN_PRESENTED",
        };

        await postMandateApi({
          investorId: authDetail.userType === "partner" ? params.investorId : undefined,
          payload: payload,
        }).unwrap();

        reset();
        closeMandateModal();
      } catch {
        //pass
      }
    },
    [postMandateApi, closeMandateModal, reset, authDetail.userType, params]
  );

  useEffect(() => {
    if (!mandateCreateData || !mandateCreateData.data) return;
    openMandateApproveModal();
  }, [mandateCreateData, openMandateApproveModal]);

  return (
    <>
      <FlexRow justifyContent="space-between">
        {authDetail.userType === "investor" ? (
          <Typography size="5" weight="medium">
            Mandates
          </Typography>
        ) : (
          <Typography> </Typography>
        )}
        <Button variant="soft" title="Add Mandate" onPress={openMandateModal} />
      </FlexRow>
      <Padding height={16} />

      {isFetchingMandate ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      <MandateList data={mandateData.list} isLoading={isFetchingMandate} />

      <CustomModal
        minWidth={400}
        heightPercent={70}
        title="Add Mandate"
        footerTitle="Add Mandate"
        closeModal={closeMandateModal}
        onConfirm={handleSubmit(onSubmit)}
        isModalVisible={isMandateModalVisible}
        primaryBtnProps={{
          disabled: isPostingMandate,
          loading: isPostingMandate,
        }}
      >
        <NewMandateForm control={control} setValue={setValue} mandateType={mandateType.value} />
      </CustomModal>

      <CustomModal
        heightPercent={70}
        title="Approve Mandate"
        footerTitle="Ok"
        onConfirm={closeMandateApproveModal}
        closeModal={closeMandateApproveModal}
        isModalVisible={isMandateApproveModalVisible}
      >
        <Padding height={16} />
        {mandateCreateData?.data?.link ? (
          <>
            <Typography align="center">Please copy the link and open it in your browser</Typography>
            <Padding height={16} />
            <CopyToClipboard title="Mandate Link" value={mandateCreateData?.data?.link} />
          </>
        ) : (
          <Typography>Mandate has been sent to your UPI ID. Please approve it.</Typography>
        )}
        <Padding height={16} />
      </CustomModal>
    </>
  );
}

export default React.memo(Mandates);
