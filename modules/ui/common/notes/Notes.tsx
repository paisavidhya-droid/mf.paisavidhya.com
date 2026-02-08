import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext } from "@niveshstar/context";
import {
  useDeleteInvestorNoteMutation,
  useGetInvestorNoteQuery,
  usePostInvestorNoteMutation,
} from "@niveshstar/context/api/investorNoteApi";
import { useNavigation } from "@niveshstar/hook";

import Button from "../../Button";
import ControlledInput from "../../ControlledInput";
import CustomCard from "../../CustomCard";
import CustomModal from "../../CustomModal";
import EmptyResult from "../../EmptyResult";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import NotesRow from "./NotesRow";

const defaultValues = {
  note: "",
};

function Notes() {
  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const { data: notes = [], isFetching: isFetchingNotes } = useGetInvestorNoteQuery(params?.investorId, {
    skip: !params?.investorId,
  });

  const [postInvestorNoteApi, { isLoading: isPostingInvestorNote }] = usePostInvestorNoteMutation();
  const [deleteInvestorNoteApi, { isLoading: isDeletingInvestorNote }] = useDeleteInvestorNoteMutation();

  const [selectedNotesId, setSelectedNotesId] = useState(null);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const openCreateModal = useCallback(() => {
    setCreateModalVisible(true);
  }, []);
  const closeCreateModal = useCallback(() => {
    setCreateModalVisible(false);
    reset();
  }, [reset]);

  const openDeleteModal = useCallback(() => {
    setDeleteModalVisible(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setDeleteModalVisible(false);
    setSelectedNotesId(null);
  }, []);

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          profile_id: params.investorId,
          partner_id: authDetail.id,
          notes: data.note,
        };
        await postInvestorNoteApi(payload).unwrap();
        closeCreateModal();
      } catch {
        //pass
      }
    },
    [postInvestorNoteApi, closeCreateModal, authDetail.id, params]
  );

  const hanldeSelectNotesId = useCallback((id: string) => {
    setSelectedNotesId(id);
  }, []);

  const handleNoteDelete = useCallback(async () => {
    try {
      await deleteInvestorNoteApi(selectedNotesId).unwrap();
      closeDeleteModal();
    } catch {
      // hpass
    }
  }, [deleteInvestorNoteApi, closeDeleteModal, selectedNotesId]);

  useEffect(() => {
    if (!selectedNotesId) return;
    openDeleteModal();
  }, [openDeleteModal, selectedNotesId]);

  return (
    <CustomCard style={{ flexGrow: 1 }}>
      <FlexRow justifyContent="space-between">
        <Typography size="5" weight="medium">
          Notes
        </Typography>
        <Button title="Add Note" onPress={openCreateModal} variant="soft" />
      </FlexRow>
      <Padding height={24} />

      {isFetchingNotes ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {!isFetchingNotes ? (
        <FlatList
          data={notes}
          nestedScrollEnabled={true}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotesRow data={item} hanldeSelectNotesId={hanldeSelectNotesId} />}
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          ListEmptyComponent={EmptyResult}
        />
      ) : null}

      <CustomModal
        minWidth={500}
        title="Add Note"
        footerTitle="Add"
        heightPercent={70}
        closeModal={closeCreateModal}
        onConfirm={handleSubmit(onSubmit)}
        isModalVisible={isCreateModalVisible}
        primaryBtnProps={{
          loading: isPostingInvestorNote,
          disabled: isPostingInvestorNote,
        }}
      >
        <ControlledInput
          multiline
          name="note"
          label="Notes"
          control={control}
          numberOfLines={4}
          placeholder="Enter notes"
          rules={{
            required: {
              value: true,
              message: "Please enter notes",
            },
          }}
        />
      </CustomModal>

      <CustomModal
        title="Delete Note"
        footerTitle="Delete"
        onConfirm={handleNoteDelete}
        closeModal={closeDeleteModal}
        isModalVisible={isDeleteModalVisible}
        primaryBtnProps={{
          color: "danger",
          loading: isDeletingInvestorNote,
          disabled: isDeletingInvestorNote,
        }}
      >
        <Typography>Are you sure you want to delete this note?</Typography>
      </CustomModal>
    </CustomCard>
  );
}

export default React.memo(Notes);
