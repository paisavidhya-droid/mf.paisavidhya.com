import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import {
  ScreenContext,
  ThemeContext,
  useDeleteMandateMutation,
  useLazyGetMandateApprovalLinkQuery,
  useLazyGetMandateBseDetailsQuery,
} from "@niveshstar/context";
import { toastHelper } from "@niveshstar/utils";

import Column from "../../Column";
import CopyToClipboard from "../../CopyToClipboard";
import CustomModal from "../../CustomModal";
import EmptyResult from "../../EmptyResult";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import MandateDetailsModal from "./MandateDetailsModal";
import MandateRow from "./MandateRow";

interface PropsType {
  data: any;
  isLoading: boolean;
}

function MandateList(props: PropsType) {
  const { data, isLoading } = props;

  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedMandate, setSelectedMandate] = useState({ id: null, purpose: null });
  const [isMandateApproveModalVisible, setIsMandateApproveModalVisible] = useState(false);

  const [deleteMandateApi, { isLoading: isDeletingMandate }] = useDeleteMandateMutation();

  const [
    getMandateBseDetailsApi,
    { isFetching: isFetchingMandateBseDetails, data: mandateBseData, isError: manadateBseIsError },
  ] = useLazyGetMandateBseDetailsQuery();

  const [
    getMandateLinkApi,
    { isFetching: isFetchingMandateLink, data: mandateLinkData, isError: manadateLinkIsError },
  ] = useLazyGetMandateApprovalLinkQuery();

  const openDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(false);
    setSelectedMandate({ id: null, purpose: null });
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsDetailsModalVisible(false);
    setSelectedMandate({ id: null, purpose: null });
  }, []);

  const openDetailsModal = useCallback(() => {
    setIsDetailsModalVisible(true);
  }, []);

  const openMandateApproveModal = useCallback(() => {
    setIsMandateApproveModalVisible(true);
    setSelectedMandate({ id: null, purpose: null });
  }, []);

  const closeMandateApproveModal = useCallback(() => {
    setIsMandateApproveModalVisible(false);
  }, []);

  const handleSelectMandate = useCallback((id: string, purpose: "delete" | "details" | "link") => {
    setSelectedMandate({ id: id, purpose: purpose });
  }, []);

  const handleRemoveMandate = useCallback(async () => {
    try {
      await deleteMandateApi(selectedMandate.id).unwrap();
      closeDeleteModal();
      toastHelper("success", "Deleted Successfully!");
    } catch {
      //pass
    }
  }, [closeDeleteModal, deleteMandateApi, selectedMandate]);

  useEffect(() => {
    if (!selectedMandate.id) return;
    if (selectedMandate.purpose === "delete") {
      openDeleteModal();
    } else if (selectedMandate.purpose === "link") {
      getMandateLinkApi(selectedMandate.id);
      openMandateApproveModal();
    } else if (selectedMandate.purpose === "details") {
      getMandateBseDetailsApi(selectedMandate.id);
      openDetailsModal();
    }
  }, [
    selectedMandate,
    openDeleteModal,
    openDetailsModal,
    getMandateBseDetailsApi,
    openMandateApproveModal,
    getMandateLinkApi,
  ]);

  const columnSize = screenType === "sm" ? 24 : screenType === "md" ? 12 : 6;

  return (
    <>
      {!isLoading && data.length === 0 ? <EmptyResult /> : null}

      {!isLoading ? (
        <FlexRow offset={8} alignItems="stretch" rowGap={16} wrap>
          {data.map((val: any, index: number) => (
            <Column offset={8} col={columnSize} key={index}>
              <MandateRow data={val} handleSelectMandate={handleSelectMandate} />
            </Column>
          ))}
        </FlexRow>
      ) : null}

      <CustomModal
        footerTitle="Delete"
        title="Confirm Delete"
        closeModal={closeDeleteModal}
        onConfirm={handleRemoveMandate}
        isModalVisible={isDeleteModalVisible}
        primaryBtnProps={{
          color: "danger",
          disabled: isDeletingMandate,
          loading: isDeletingMandate,
        }}
      >
        <Typography>Are you sure you want to delete the selected mandate?</Typography>
      </CustomModal>

      <CustomModal
        heightPercent={70}
        title="Mandate Details"
        closeModal={closeDetailsModal}
        isModalVisible={isDetailsModalVisible}
      >
        <MandateDetailsModal
          data={mandateBseData}
          isError={manadateBseIsError}
          isLoading={isFetchingMandateBseDetails}
        />
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
        {isFetchingMandateLink ? (
          <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </FlexRow>
        ) : null}

        {!isFetchingMandateLink && manadateLinkIsError ? (
          <Typography size="2" color={themeColor.red[11]}>
            {mandateLinkData?.data?.message ?? "An error occurred while fetching approval link"}
          </Typography>
        ) : null}

        {!isFetchingMandateLink && !manadateLinkIsError && mandateLinkData?.data?.link ? (
          <>
            <Typography align="center">Please copy the link and open it in your browser</Typography>
            <Padding height={16} />
            <CopyToClipboard title="Mandate Link" value={mandateLinkData?.data?.link} />
          </>
        ) : null}
        <Padding height={16} />
      </CustomModal>
    </>
  );
}

export default React.memo(MandateList);
