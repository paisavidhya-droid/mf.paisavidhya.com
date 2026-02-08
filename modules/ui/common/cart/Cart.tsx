import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";

import {
  RootStateType,
  ScreenContext,
  ThemeContext,
  useDeleteCartMutation,
  useGetCartQuery,
  useLazyGetApprovalLinkQuery,
  usePostBulkDeleteCartMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { convertCurrencyToString, toastHelper } from "@niveshstar/utils";

import Button from "../../Button";
import Column from "../../Column";
import CustomCard from "../../CustomCard";
import CustomModal from "../../CustomModal";
import Divider from "../../Divider";
import EmptyResult from "../../EmptyResult";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import BucketContainer from "../bucket/BucketContainer";
import InvestForm from "../home/InvestForm";
import CartItemRow from "./CartItemRow";

function Cart() {
  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isBucketModalVisible, setIsBucketModalVisible] = useState(false);
  const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
  const [isBulkDeleteModalVisible, setIsBulkDeleteModalVisible] = useState(false);

  const authDetail = useSelector((state: RootStateType) => state.auth);
  const columnSize = screenType === "sm" ? 24 : 12;

  const { data: cartData = [], isFetching: isFetchingCart } = useGetCartQuery(
    authDetail.userType === "partner" ? params?.investorId : undefined,
    {
      skip: authDetail.userType === "partner" && !params?.investorId,
    }
  );

  const [deleteCartItemApi, { isLoading: isDeletingCartItem }] = useDeleteCartMutation();
  const [bulkDeleteCartApi, { isLoading: isBulkDeletingCart }] = usePostBulkDeleteCartMutation();
  const [getApprovalLinkApi, { isFetching: isFetchingApprovalLink }] = useLazyGetApprovalLinkQuery();

  const openBucketModal = useCallback(() => setIsBucketModalVisible(true), []);
  const closeBucketModal = useCallback(() => setIsBucketModalVisible(false), []);

  const openBulkDeleteModal = useCallback(() => {
    setIsBulkDeleteModalVisible(true);
  }, []);
  const closeBulkDeleteModal = useCallback(() => {
    setIsBulkDeleteModalVisible(false);
  }, []);

  const openApprovalModal = useCallback(() => {
    setIsApprovalModalVisible(true);
  }, []);
  const closeApprovalModal = useCallback(() => {
    setIsApprovalModalVisible(false);
  }, []);

  const openDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(false);
    setSelectedItem(null);
  }, []);

  const openNewModal = useCallback(() => {
    setIsNewModalVisible(true);
  }, []);
  const closeNewModal = useCallback(() => {
    setIsNewModalVisible(false);
    setSelectedItem(null);
  }, []);

  const handleSelectItem = useCallback((item: any, purpose: "delete" | "edit") => {
    setSelectedItem({ ...item, purpose: purpose });
  }, []);

  const handleGetApprovalLink = useCallback(async () => {
    try {
      await getApprovalLinkApi(params.investorId).unwrap();
      closeApprovalModal();
      setTimeout(() => {
        toastHelper("success", "Approval Link Sent to Client!");
      }, 200);
    } catch {
      //pass
    }
  }, [getApprovalLinkApi, params, closeApprovalModal]);

  const handleRemoveAll = useCallback(async () => {
    try {
      const payload = {
        investorId: params.investorId,
        cart_ids: cartData.map((val) => val.id),
      };
      await bulkDeleteCartApi(payload).unwrap();
      closeBulkDeleteModal();
    } catch {
      //pass
    }
  }, [cartData, bulkDeleteCartApi, closeBulkDeleteModal, params]);

  const handleRemoveItem = useCallback(async () => {
    try {
      await deleteCartItemApi(selectedItem.id).unwrap();
      closeDeleteModal();
    } catch {
      //do nothing
    }
  }, [deleteCartItemApi, selectedItem, closeDeleteModal]);

  const isStartDateExpired = useMemo(() => {
    const minStartDate = moment().startOf("day").add(4, "days");

    return cartData?.some((val: any) => {
      if (!val.start_date) return false;
      const startDate = moment(val.start_date);
      return startDate.isBefore(minStartDate);
    });
  }, [cartData]);

  useEffect(() => {
    if (!selectedItem || !selectedItem.purpose) return;
    if (selectedItem.purpose === "delete") openDeleteModal();
    else openNewModal();
  }, [selectedItem, openDeleteModal, openNewModal]);

  return (
    <CustomCard style={{ flexGrow: 1 }}>
      <FlexRow justifyContent="space-between">
        <FlexRow>
          <Button
            variant="soft"
            color="danger"
            title="Clear all"
            onPress={openBulkDeleteModal}
            disabled={cartData.length === 0}
          />
        </FlexRow>
        <FlexRow colGap={8}>
          <Button
            variant="soft"
            onPress={openApprovalModal}
            title="Generate Approval Link"
            disabled={cartData.length === 0}
          />
          <Button variant="soft" title="Add Funds" onPress={openNewModal} />
          <Button variant="soft" title="Add Bucket" onPress={openBucketModal} />
        </FlexRow>
      </FlexRow>

      <Padding height={16} />

      {isFetchingCart ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {!isFetchingCart && cartData.length === 0 ? <EmptyResult /> : null}

      {!isFetchingCart ? (
        <FlexRow offset={8} rowGap={16} alignItems="stretch" wrap>
          {cartData.map((val: any) => (
            <Column offset={8} col={columnSize} key={val.id}>
              <CartItemRow data={val} handleSelectItem={handleSelectItem} />
            </Column>
          ))}
        </FlexRow>
      ) : null}

      <InvestForm
        closeModal={closeNewModal}
        isModalVisible={isNewModalVisible}
        cartData={selectedItem && selectedItem.purpose === "edit" ? selectedItem : null}
        schemeId={selectedItem && selectedItem.purpose === "edit" ? selectedItem.scheme.id : null}
      />

      <CustomModal
        footerTitle="Delete"
        title="Confirm Delete"
        onConfirm={handleRemoveAll}
        closeModal={closeBulkDeleteModal}
        isModalVisible={isBulkDeleteModalVisible}
        primaryBtnProps={{
          color: "danger",
          disabled: isBulkDeletingCart,
          loading: isBulkDeletingCart,
        }}
      >
        <Typography>Are you sure you want to delete all items from the cart?</Typography>
      </CustomModal>

      <CustomModal
        footerTitle="Delete"
        title="Confirm Delete"
        onConfirm={handleRemoveItem}
        closeModal={closeDeleteModal}
        isModalVisible={isDeleteModalVisible}
        primaryBtnProps={{
          color: "danger",
          disabled: isDeletingCartItem,
          loading: isDeletingCartItem,
        }}
      >
        <Typography>Are you sure you want to delete the selected fund?</Typography>
      </CustomModal>

      <CustomModal
        title="Send Approval Link"
        footerTitle="Confirm"
        onConfirm={handleGetApprovalLink}
        closeModal={closeApprovalModal}
        isModalVisible={isApprovalModalVisible}
        primaryBtnProps={{
          disabled: isStartDateExpired || isFetchingApprovalLink,
          loading: isFetchingApprovalLink,
        }}
      >
        {isStartDateExpired ? (
          <>
            <Padding height={16} />
            <Typography color={themeColor.red[9]}>
              Some orders have a start date that is not at least 4 days from today. Please update them before
              proceeding.
            </Typography>
          </>
        ) : null}

        {!isStartDateExpired ? (
          <>
            <Typography size="3" color={themeColor.blue[9]} weight="medium">
              Approval link will be sent to the client's registered email address
            </Typography>
            <Padding height={16} />
            <Divider />
            <Padding height={16} />
            <Typography size="3" weight="medium">
              Order Summary
            </Typography>
            <Padding height={16} />
            {cartData.map((val: any) => (
              <React.Fragment key={val.id}>
                <FlexRow justifyContent="space-between">
                  <Typography>{val.scheme.name}</Typography>
                  <Padding width={8} />
                  <Typography weight="bold">{convertCurrencyToString(val.amount)}</Typography>
                </FlexRow>
                <Padding height={16} />
                <Divider />
                <Padding height={16} />
              </React.Fragment>
            ))}
          </>
        ) : null}
      </CustomModal>

      <CustomModal
        minWidth={650}
        heightPercent={80}
        title="Add Bucket"
        closeModal={closeBucketModal}
        isModalVisible={isBucketModalVisible}
      >
        <BucketContainer isParentAModal closeParentModal={closeBucketModal} />
      </CustomModal>
    </CustomCard>
  );
}

export default React.memo(Cart);
