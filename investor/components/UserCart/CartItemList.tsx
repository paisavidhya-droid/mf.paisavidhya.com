import React, { useCallback, useEffect, useState } from "react";

import { useDeleteCartMutation } from "@niveshstar/context";
import { CustomModal, FlexRow, InvestForm, Padding, RedeemForm, Typography } from "@niveshstar/ui";

import CartItemRow from "./CartItemRow";

interface PropsType {
  data: any;
}

function CartItemList(props: PropsType) {
  const { data } = props;

  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [deleteCartItemApi, { isLoading: isDeletingCartItem }] = useDeleteCartMutation();

  const openEditModal = useCallback(() => {
    setIsEditModalVisible(true);
  }, []);
  const closeEditModal = useCallback(() => {
    setIsEditModalVisible(false);
    setSelectedItem(null);
  }, []);

  const openDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(false);
    setSelectedItem(null);
  }, []);

  const handleSelectItem = useCallback((item: any, purpose: "delete" | "edit") => {
    setSelectedItem({ ...item, purpose: purpose });
  }, []);

  const handleRemoveItem = useCallback(async () => {
    try {
      await deleteCartItemApi(selectedItem.id).unwrap();
      closeDeleteModal();
    } catch {
      //do nothing
    }
  }, [deleteCartItemApi, selectedItem, closeDeleteModal]);

  useEffect(() => {
    if (!selectedItem || !selectedItem.purpose) return;
    if (selectedItem.purpose === "delete") openDeleteModal();
    else openEditModal();
  }, [selectedItem, openDeleteModal, openEditModal]);

  return (
    <>
      <FlexRow alignItems="stretch" style={{ flexDirection: "column" }} rowGap={16}>
        {data.map((val: any, i: number) => (
          <CartItemRow data={val} key={i} handleSelectItem={handleSelectItem} />
        ))}
      </FlexRow>
      <Padding height={16} />

      <InvestForm
        closeModal={closeEditModal}
        schemeId={selectedItem && selectedItem.purpose === "edit" ? selectedItem.scheme.id : null}
        isModalVisible={isEditModalVisible && selectedItem && selectedItem.order_type !== "REDEMPTION"}
        cartData={
          selectedItem && selectedItem.purpose === "edit" && selectedItem.order_type !== "REDEMPTION"
            ? selectedItem
            : null
        }
      />

      <RedeemForm
        closeModal={closeEditModal}
        schemeId={selectedItem && selectedItem.purpose === "edit" ? selectedItem.scheme.id : null}
        isModalVisible={isEditModalVisible && selectedItem && selectedItem.order_type === "REDEMPTION"}
        cartData={
          selectedItem && selectedItem.purpose === "edit" && selectedItem.order_type === "REDEMPTION"
            ? selectedItem
            : null
        }
      />

      <CustomModal
        minWidth={400}
        footerTitle="Delete"
        title="Confirm Delete"
        onConfirm={handleRemoveItem}
        closeModal={closeDeleteModal}
        isModalVisible={isDeleteModalVisible}
        primaryBtnProps={{
          loading: isDeletingCartItem,
          disabled: isDeletingCartItem,
          color: "danger",
        }}
      >
        <Typography>
          Are you sure you want to delete the <Typography weight="medium">{selectedItem?.scheme_name}</Typography>?
        </Typography>
      </CustomModal>
    </>
  );
}

export default React.memo(CartItemList);
