import React, { useCallback, useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import {
  countryOptions,
  emailRegex,
  genderOptions,
  incomeSlabOptions,
  nameRegex,
  occupationOptions,
  panNumberRegex,
  pepDetailsOptions,
  phoneRegex,
  sourceOfWealthOptions,
} from "@niveshstar/constant";
import {
  RootStateType,
  ScreenContext,
  ThemeContext,
  usePatchHolderMutation,
  usePatchIdentifierMutation,
  usePostHolderMutation,
  usePostIdentifierMutation,
} from "@niveshstar/context";
import {
  Button,
  Column,
  ControlledDropDown,
  ControlledInput,
  CustomCard,
  CustomModal,
  DatePicker,
  EmptyResult,
  FlexRow,
  getInvestorPayload,
  Padding,
  Typography,
  updateInvestorForm,
} from "@niveshstar/ui";

import HolderRow from "./HolderRow";

interface PropsType {
  investorProfile: any;
}

const defaultValues = {
  holder: {
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: { name: "", value: "" },
    holder_rank: { name: "Second", value: "SECOND" },
    date_of_birth: "",
    place_of_birth: "",
    country_of_birth: { name: "", value: "" },
    occupation: { name: "", value: "" },
    source_of_wealth: { name: "", value: "" },
    income_slab: { name: "", value: "" },
    pep_details: { name: "", value: "" },
    email: "",
    mobile: "",
    identity_type: { value: "PAN", name: "Pan" },
    pan: "",
  },
};

function HolderTab(props: PropsType) {
  const { investorProfile } = props;
  const holderDetails = investorProfile.holder;

  const { screenType } = useContext(ScreenContext);
  const { themeColor } = useContext(ThemeContext);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const authDetail = useSelector((state: RootStateType) => state.auth);
  const isDisabled = Boolean(authDetail.uccRegistered);

  const colSize = screenType === "sm" ? 24 : screenType === "md" ? 12 : 8;

  const [postHolderApi, { isLoading: isPostingHolder }] = usePostHolderMutation();
  const [patchHolderApi, { isLoading: isPatchingHolder }] = usePatchHolderMutation();
  const [postIdentifierApi, { isLoading: isPostingIdentifier }] = usePostIdentifierMutation();
  const [patchIdentifierApi, { isLoading: isPatchingIdentifier }] = usePatchIdentifierMutation();

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const openNewModal = useCallback(() => {
    setIsNewModalOpen(true);
  }, []);
  const closeNewModal = useCallback(() => {
    setIsNewModalOpen(false);
    setSelectedIndex(-1);
    reset();
  }, [reset]);

  const handleEditClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = await getInvestorPayload(data, "HOLDER");

        if (selectedIndex !== -1) {
          await patchHolderApi({ id: holderDetails[selectedIndex].id, payload: payload.holder }).unwrap();
          payload.identifier.holder_id = holderDetails[selectedIndex].id;
          await patchIdentifierApi({
            id: holderDetails[selectedIndex].identifier[0].id,
            payload: payload.identifier,
          }).unwrap();
        } else {
          const res = await postHolderApi({ investorId: undefined, payload: payload.holder }).unwrap();
          payload.identifier.holder_id = res.data.id;
          await postIdentifierApi({ investorId: undefined, payload: payload.identifier }).unwrap();
        }

        closeNewModal();
      } catch {
        // pass
      }
    },
    [patchHolderApi, closeNewModal, postHolderApi, holderDetails, selectedIndex, patchIdentifierApi, postIdentifierApi]
  );

  useEffect(() => {
    if (selectedIndex === -1) return;
    updateInvestorForm(investorProfile, setValue, "HOLDER", selectedIndex);
    openNewModal();
  }, [selectedIndex, openNewModal, setValue, investorProfile]);

  return (
    <CustomCard>
      <FlexRow justifyContent="space-between">
        <Typography align="left" size="5" weight="medium">
          Holders
        </Typography>
        <Button
          variant="soft"
          onPress={openNewModal}
          disabled={isDisabled}
          title="Add New Holder"
          icon={<AntDesign name="plus" size={18} color={themeColor.accent[11]} />}
        />
      </FlexRow>
      <Padding height={24} />

      {holderDetails.length === 0 ? (
        <EmptyResult style={{ minHeight: 200 }} />
      ) : (
        <FlexRow offset={8} alignItems="stretch">
          {holderDetails.map((val: any, i: number) => (
            <Column col={colSize} offset={8} key={i}>
              <HolderRow data={val} index={i} handleEditClick={handleEditClick} isDisabled={isDisabled} />
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
        footerTitle={selectedIndex !== -1 ? "Update" : "Add"}
        title={selectedIndex !== -1 ? "Update Holder" : "Add Holder"}
        primaryBtnProps={{
          disabled: isPostingHolder || isPatchingHolder || isPostingIdentifier || isPatchingIdentifier,
          loading: isPostingHolder || isPatchingHolder || isPostingIdentifier || isPatchingIdentifier,
        }}
      >
        <ControlledInput
          label="First Name"
          name="holder.first_name"
          control={control}
          placeholder="Enter first name"
          rules={{
            required: {
              value: true,
              message: "Please enter a first name",
            },
            pattern: {
              value: nameRegex,
              message: "Please enter a valid name",
            },
          }}
        />
        <Padding height={16} />

        <ControlledInput
          label="Middle Name"
          name="holder.middle_name"
          control={control}
          placeholder="Enter middle name"
          rules={{
            pattern: {
              value: nameRegex,
              message: "Please enter a valid name",
            },
          }}
        />
        <Padding height={16} />

        <ControlledInput
          label="Last Name"
          name="holder.last_name"
          control={control}
          placeholder="Enter last name"
          rules={{
            required: {
              value: true,
              message: "Please enter a last name",
            },
            pattern: {
              value: nameRegex,
              message: "Please enter a valid name",
            },
          }}
        />

        <Padding height={16} />

        <ControlledDropDown
          key="gender"
          label="Gender"
          name="holder.gender"
          placeholder="Select gender"
          control={control}
          options={genderOptions}
          rules={{
            required: {
              value: true,
              message: "Please select gender",
            },
          }}
        />

        <Padding height={16} />

        <DatePicker
          control={control}
          placeholder="Select date of birth"
          name="holder.date_of_birth"
          label="Date of Birth"
          rules={{
            required: {
              value: true,
              message: "Please select date of birth",
            },
          }}
        />

        <Padding height={16} />

        <ControlledInput
          name="holder.place_of_birth"
          placeholder="Enter place of birth"
          control={control}
          label="Place of Birth"
          rules={{
            required: {
              value: true,
              message: "Please enter place of birth",
            },
            minLength: {
              value: 2,
              message: "Place of birth must be at least 2 characters",
            },
            maxLength: {
              value: 50,
              message: "Place of birth must be at most 50 characters",
            },
          }}
        />

        <Padding height={16} />

        <ControlledDropDown
          key="holder.country_of_birth"
          disabled={isDisabled}
          label="Country of Birth"
          name="holder.country_of_birth"
          control={control}
          placeholder="Start typing to search"
          options={countryOptions}
          rules={{
            required: {
              value: true,
              message: "Please select country of birth",
            },
          }}
        />

        <Padding height={16} />

        <ControlledDropDown
          key="occupation"
          label="Occupation"
          name="holder.occupation"
          placeholder="Select occupation"
          control={control}
          options={occupationOptions}
          rules={{
            required: {
              value: true,
              message: "Please select occupation",
            },
          }}
        />

        <Padding height={16} />

        <ControlledDropDown
          key="source_of_wealth"
          label="Source of Wealth"
          name="holder.source_of_wealth"
          placeholder="Select source of wealth"
          control={control}
          options={sourceOfWealthOptions}
          rules={{
            required: {
              value: true,
              message: "Please select source of wealth",
            },
          }}
        />

        <Padding height={16} />

        <ControlledDropDown
          key="income_slab"
          label="Income Slab"
          name="holder.income_slab"
          placeholder="Select income slab"
          control={control}
          options={incomeSlabOptions}
          rules={{
            required: {
              value: true,
              message: "Please select income slab",
            },
          }}
        />

        <Padding height={16} />

        <ControlledDropDown
          key="pep_details"
          label="Politically Exposed Person"
          name="holder.pep_details"
          placeholder="Select PEP status"
          control={control}
          options={pepDetailsOptions}
          rules={{
            required: {
              value: true,
              message: "Please select PEP status",
            },
          }}
        />

        <Padding height={16} />

        <ControlledInput
          name="holder.email"
          placeholder="Enter email address"
          control={control}
          label="Email Address"
          inputMode="email"
          rules={{
            required: {
              value: true,
              message: "Please enter email address",
            },
            pattern: {
              value: emailRegex,
              message: "Please enter a valid email address",
            },
          }}
        />

        <Padding height={16} />

        <ControlledInput
          name="holder.mobile"
          placeholder="Enter mobile number"
          control={control}
          label="Mobile Number"
          inputMode="numeric"
          keyboardType="number-pad"
          rules={{
            required: {
              value: true,
              message: "Please enter phone number",
            },
            pattern: {
              value: phoneRegex,
              message: "Please enter a valid phone number",
            },
            minLength: {
              value: 10,
              message: "Please enter a valid phone number",
            },
            maxLength: {
              value: 10,
              message: "Please enter a valid phone number",
            },
          }}
        />

        <Padding height={16} />

        <ControlledInput
          name="holder.pan"
          placeholder="Enter PAN number"
          control={control}
          label="PAN"
          rules={{
            required: {
              value: true,
              message: "Please enter PAN number",
            },
            minLength: {
              value: 10,
              message: "PAN must be 10 characters",
            },
            maxLength: {
              value: 10,
              message: "PAN must be 10 characters",
            },
            pattern: {
              value: panNumberRegex,
              message: "Please enter a valid PAN",
            },
          }}
        />
      </CustomModal>
    </CustomCard>
  );
}

export default React.memo(HolderTab);