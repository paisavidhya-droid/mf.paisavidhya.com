import React, { useCallback, useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { bankAccountTypeOptions, numberRegex } from "@niveshstar/constant";
import {
  RootStateType,
  ScreenContext,
  ThemeContext,
  useDeleteBankAccountMutation,
  usePatchBankAccountMutation,
  usePostBankAccountMutation,
  usePostFileBase64Mutation,
  usePostUpdateUccMutation,
  usePostUpdateUccOtpMutation,
} from "@niveshstar/context";
import {
  Button,
  Column,
  ControlledDropDown,
  ControlledInput,
  CustomCard,
  CustomModal,
  EmptyResult,
  FlexRow,
  getInvestorPayload,
  IfscInput,
  ImagePicker,
  Padding,
  Typography,
  updateInvestorForm,
} from "@niveshstar/ui";

import BankRow from "./BankRow";

interface PropsType {
  investorProfile: any;
}

const defaultValues = {
  bank_account: {
    account_holder_name: "",
    account_number: "",
    bank_type: { name: "", value: "" },
    ifsc_code: "",
    branch_name: "",
    bank_name: "",
    bank_owner: "SELF",
    branch_address: "",
    cancelled_cheque: "",
    mobile: "",
    email: "",
    otp: "",
    otp_id: "",
    new_upi: "",
  },
};

function BankTab(props: PropsType) {
  const { investorProfile } = props;

  const bankDetails = investorProfile.bank_account;

  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ index: -1, purpose: "" });

  const authDetail = useSelector((state: RootStateType) => state.auth);
  const isDisabled = Boolean(authDetail.uccRegistered);

  const colSize = screenType === "sm" ? 24 : screenType === "md" ? 12 : 8;

  const [postBankApi, { isLoading: isPostingBank }] = usePostBankAccountMutation();
  const [patchBankApi, { isLoading: isPatchingBank }] = usePatchBankAccountMutation();
  const [postFileBase64Api, { isLoading: isPostingFile }] = usePostFileBase64Mutation();
  const [deleteBankApi, { isLoading: isDeletingBank }] = useDeleteBankAccountMutation();
  const [postUpdateUccApi, { isLoading: isPostingUpdateUcc }] = usePostUpdateUccMutation();
  const [postUpdateUccOtpApi, { isLoading: isPostingUpdateUccOtp }] = usePostUpdateUccOtpMutation();

  const { control, handleSubmit, setValue, reset, watch, trigger } = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "all",
  });

  const otpEmail = watch("bank_account.email");

  const openNewModal = useCallback(() => {
    setIsNewModalOpen(true);
  }, []);
  const closeNewModal = useCallback(() => {
    setIsNewModalOpen(false);
    setSelectedItem({ index: -1, purpose: "" });
    reset();
  }, [reset]);

  const openOtpModal = useCallback(() => {
    setIsOtpModalVisible(true);
  }, []);
  const closeOtpModal = useCallback(() => {
    setIsOtpModalVisible(false);
    setSelectedItem({ index: -1, purpose: "" });
    reset();
  }, [reset]);

  const openDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(false);
    setSelectedItem({ index: -1, purpose: "" });
  }, []);

  const handleSelectItem = useCallback((index: number, purpose: "EDIT" | "DELETE") => {
    setSelectedItem({ index, purpose });
  }, []);

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = await getInvestorPayload(data, "BANK");

        if (payload.cancelled_cheque) {
          const imgRes = await postFileBase64Api({
            investorId: undefined,
            payload: payload.cancelled_cheque,
          }).unwrap();

          payload.bank.cancelled_cheque_id = imgRes.data.id;
        }

        const selectedIndex = selectedItem.index;

        if (isDisabled && selectedIndex === -1) {
          const res = await postUpdateUccOtpApi({ type: "ADD_BANK_ACCOUNT", payload: payload.bank }).unwrap();

          setValue("bank_account.email", res.data.email);
          setValue("bank_account.otp_id", res.data.otp_id);
          // setValue("bank_account.mobile", res.data.mobile);
          openOtpModal();
          //
        } else if (isDisabled && selectedIndex !== -1) {
          const updatePayload = {
            id: bankDetails[selectedIndex].id,
            ...payload.bank,
          };
          const res = await postUpdateUccOtpApi({ type: "UPDATE_BANK_ACCOUNT", payload: updatePayload }).unwrap();

          setValue("bank_account.email", res.data.email);
          setValue("bank_account.otp_id", res.data.otp_id);
          // setValue("bank_account.mobile", res.data.mobile);
          openOtpModal();
          //
        } else if (!isDisabled && selectedIndex === -1) {
          await postBankApi({ investorId: undefined, payload: payload.bank }).unwrap();
          closeNewModal();
          //
        } else {
          await patchBankApi({ id: bankDetails[selectedIndex].id, payload: payload.bank }).unwrap();
          closeNewModal();
        }
      } catch {
        // pass
      }
    },
    [
      patchBankApi,
      closeNewModal,
      postBankApi,
      postFileBase64Api,
      bankDetails,
      selectedItem,
      isDisabled,
      setValue,
      postUpdateUccOtpApi,
      openOtpModal,
    ]
  );

  const verifyOtp = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          otp_id: data.bank_account.otp_id,
          otp: data.bank_account.otp,
        };
        await postUpdateUccApi(payload).unwrap();

        closeOtpModal();
        closeNewModal();
        closeDeleteModal();
      } catch {
        //pass
      }
    },
    [postUpdateUccApi, closeOtpModal, closeNewModal, closeDeleteModal]
  );

  const onRemove = useCallback(async () => {
    try {
      if (isDisabled) {
        const payload = { id: bankDetails[selectedItem.index].id };
        const res = await postUpdateUccOtpApi({ type: "DELETE_BANK_ACCOUNT", payload: payload }).unwrap();

        setValue("bank_account.email", res.data.email);
        setValue("bank_account.otp_id", res.data.otp_id);
        // setValue("bank_account.mobile", res.data.mobile);
        openOtpModal();
      } else {
        await deleteBankApi(bankDetails[selectedItem.index].id).unwrap();
        closeDeleteModal();
      }
    } catch {
      //
    }
  }, [
    bankDetails,
    selectedItem,
    deleteBankApi,
    closeDeleteModal,
    isDisabled,
    postUpdateUccOtpApi,
    openOtpModal,
    setValue,
  ]);

  useEffect(() => {
    if (selectedItem.index === -1 || !selectedItem.purpose) return;

    if (selectedItem.purpose === "EDIT") {
      openNewModal();
      updateInvestorForm(investorProfile, setValue, "BANK", selectedItem.index);
      setTimeout(() => {
        trigger("bank_account.ifsc_code");
      }, 100);
    } else {
      openDeleteModal();
    }
  }, [selectedItem, openDeleteModal, openNewModal, setValue, investorProfile, trigger]);

  return (
    <CustomCard>
      <FlexRow justifyContent="space-between">
        <Typography align="left" size="5" weight="medium">
          Bank Account
        </Typography>
        <Button
          variant="soft"
          onPress={openNewModal}
          title="Add New Bank"
          icon={<AntDesign name="plus" size={18} color={themeColor.accent[11]} />}
        />
      </FlexRow>
      <Padding height={24} />
      {bankDetails.length === 0 ? (
        <EmptyResult style={{ minHeight: 200 }} />
      ) : (
        <FlexRow offset={8} alignItems="stretch">
          {bankDetails.map((val: any, i: number) => (
            <Column col={colSize} offset={8} key={i}>
              <BankRow data={val} index={i} handleSelectItem={handleSelectItem} />
            </Column>
          ))}
        </FlexRow>
      )}

      <CustomModal
        minWidth={400}
        heightPercent={70}
        closeModal={closeNewModal}
        isModalVisible={isNewModalOpen}
        onConfirm={handleSubmit(onSubmit)}
        footerTitle={selectedItem.index !== -1 ? "Update" : "Add"}
        title={selectedItem.index !== -1 ? "Update Bank Account" : "Add Bank Account"}
        primaryBtnProps={{
          disabled: isPostingBank || isPatchingBank || isPostingFile || isPostingUpdateUccOtp,
          loading: isPostingBank || isPatchingBank || isPostingFile || isPostingUpdateUccOtp,
        }}
      >
        <ControlledInput
          key="account_holder_name"
          label="Account Holder Name"
          name="bank_account.account_holder_name"
          control={control}
          placeholder="Enter name of account holder"
          rules={{
            required: {
              value: true,
              message: "Please enter a name",
            },
          }}
        />

        <Padding height={16} />
        <ControlledInput
          key="account_number"
          label="Account Number"
          name="bank_account.account_number"
          control={control}
          placeholder="Enter account number"
          inputMode="numeric"
          keyboardType="number-pad"
          rules={{
            required: {
              value: true,
              message: "Please enter an account number",
            },
            pattern: {
              value: numberRegex,
              message: "Please enter a valid number",
            },
          }}
        />

        <Padding height={16} />
        <ControlledDropDown
          key="bank_type"
          label="Account Type"
          name="bank_account.bank_type"
          control={control}
          placeholder="Select account type"
          options={bankAccountTypeOptions}
          rules={{
            required: {
              value: true,
              message: "Please select account type",
            },
          }}
        />

        <Padding height={16} />

        <IfscInput
          control={control}
          setValue={setValue}
          ifsc_code="bank_account.ifsc_code"
          bank_name="bank_account.bank_name"
          branch_name="bank_account.branch_name"
          branch_address="bank_account.branch_address"
        />

        <Padding height={16} />

        <ImagePicker
          control={control}
          name="bank_account.cancelled_cheque"
          label="Upload Cancelled Cheque"
          title="Select Cheque"
          imageProps={{
            style: {
              width: "100%",
              minHeight: 150,
              maxHeight: 200,
            },
          }}
          rules={{
            required: {
              value: false,
              message: "Please upload a Cancelled Cheque",
            },
          }}
        />
      </CustomModal>

      <CustomModal
        minWidth={400}
        footerTitle="Delete"
        title="Confirm Delete"
        onConfirm={onRemove}
        closeModal={closeDeleteModal}
        isModalVisible={isDeleteModalVisible}
        primaryBtnProps={{
          loading: isDeletingBank,
          disabled: isDeletingBank,
          color: "danger",
        }}
      >
        <Typography>Are you sure you want to selected bank account ?</Typography>
      </CustomModal>

      <CustomModal
        footerTitle="Verify"
        title="OTP Verification"
        closeModal={closeOtpModal}
        isModalVisible={isOtpModalVisible}
        onConfirm={handleSubmit(verifyOtp)}
        primaryBtnProps={{
          disabled: isPostingUpdateUcc,
          loading: isPostingUpdateUcc,
        }}
      >
        <Typography>OTP has been sent to {otpEmail}</Typography>
        <Padding height={16} />
        <ControlledInput
          name="bank_account.otp"
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
    </CustomCard>
  );
}

export default React.memo(BankTab);
