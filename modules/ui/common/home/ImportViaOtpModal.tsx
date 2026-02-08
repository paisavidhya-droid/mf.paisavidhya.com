import React, { useCallback } from "react";
import { useForm } from "react-hook-form";

import { usePostSubmitCASDetailsMutation, usePostSubmitOtpMutation } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { toastHelper } from "@niveshstar/utils";

import Button from "../../Button";
import ControlledInput from "../../ControlledInput";
import CustomModal from "../../CustomModal";
import Divider from "../../Divider";
import Padding from "../../Padding";
import Typography from "../../Typography";

interface PropsType {
  isModalVisible: boolean;
  closeModal: () => void;
}

const defaultValues = {
  otp: "",
};

function ImportViaOtpModal(props: PropsType) {
  const { isModalVisible, closeModal } = props;

  const { params } = useNavigation();

  const { control, handleSubmit } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const [
    postSubmitCASDetailsApi,
    { data: submitCasDetailsData = { req_id: null }, isLoading: isPostingSubmitCASDetails, reset },
  ] = usePostSubmitCASDetailsMutation();

  const [postSubmitOtpApi, { isLoading: isPostingSubmitOtp }] = usePostSubmitOtpMutation();

  const handleSendOtp = useCallback(async () => {
    try {
      const payload = {
        profile_id: params.investorId,
      };
      await postSubmitCASDetailsApi(payload).unwrap();
      toastHelper("success", "OTP sent to client!");
    } catch {
      //pass
    }
  }, [postSubmitCASDetailsApi, params]);

  const handleVerifyOtp = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          req_id: submitCasDetailsData.req_id,
          otp: data.otp,
        };
        await postSubmitOtpApi(payload).unwrap();
        reset();
        closeModal();
      } catch {
        //pass
      }
    },
    [postSubmitOtpApi, submitCasDetailsData, closeModal, reset]
  );

  return (
    <CustomModal
      minWidth={400}
      maxWidth={400}
      footerTitle="Verify"
      closeModal={() => {
        closeModal();
        reset();
      }}
      title="OTP Verification"
      isModalVisible={isModalVisible}
      onConfirm={handleSubmit(handleVerifyOtp)}
      primaryBtnProps={{
        disabled: submitCasDetailsData.req_id === null || isPostingSubmitOtp,
        loading: isPostingSubmitOtp,
      }}
    >
      <Typography>
        An otp will be sent to client on their registered email via MF central to import portfolio
      </Typography>

      <Padding height={24} />

      <Button
        variant="soft"
        title="Send OTP"
        onPress={handleSendOtp}
        loading={isPostingSubmitCASDetails}
        disabled={isPostingSubmitCASDetails || isPostingSubmitOtp}
      />

      <Padding height={24} />
      <Divider />
      <Padding height={24} />

      {submitCasDetailsData.req_id === null ? null : (
        <ControlledInput
          name="otp"
          label="OTP"
          control={control}
          placeholder="Enter Otp"
          rules={{
            required: {
              value: true,
              message: "Please enter OTP",
            },
          }}
        />
      )}
    </CustomModal>
  );
}

export default React.memo(ImportViaOtpModal);
