import React, { useCallback, useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import {
  countryOptions,
  emailRegex,
  nameRegex,
  nomineeIdentityTypeOptions,
  numberRegex,
  panNumberRegex,
  relationShipOptions,
  stateOptions,
} from "@niveshstar/constant";
import {
  RootStateType,
  ScreenContext,
  ThemeContext,
  usePatchIdentifierMutation,
  usePatchRelatedPartyMutation,
  usePostIdentifierMutation,
  usePostRelatedPartyMutation,
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

import NomineeRow from "./NomineeRow";

interface PropsType {
  investorProfile: any;
}

const defaultValues = {
  nominee: {
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    relationship: { name: "", value: "" },
    nomination_percent: "100",
    identity_type: { value: "", name: "" },
    pan: "",
    adhaar: "",
    driving_license: "",
    email: "",
    mobile: "",
    line1: "",
    line2: "",
    line3: "",
    city: "",
    state: { name: "", value: "" },
    postal_code: "",
    country: { name: "", value: "" },
  },
};
function NomineeTab(props: PropsType) {
  const { investorProfile } = props;

  const nomineeDetails = investorProfile.related_party;

  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const authDetail = useSelector((state: RootStateType) => state.auth);
  const isDisabled = Boolean(authDetail.uccRegistered);

  const colSize = screenType === "sm" ? 24 : screenType === "md" ? 12 : 8;

  const [postIdentifierApi, { isLoading: isPostingIdentifier }] = usePostIdentifierMutation();
  const [patchIdentifierApi, { isLoading: isPatchingIdentifier }] = usePatchIdentifierMutation();
  const [postRelatedPartyApi, { isLoading: isPostingRelatedParty }] = usePostRelatedPartyMutation();
  const [patchRelatedPartyApi, { isLoading: isPatchingRelatedParty }] = usePatchRelatedPartyMutation();

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues,
    reValidateMode: "onSubmit",
  });

  const identityType = watch("nominee.identity_type");

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
        const payload = await getInvestorPayload(data, "NOMINEE");

        if (selectedIndex !== -1) {
          await patchRelatedPartyApi({ id: nomineeDetails[selectedIndex].id, payload: payload.nominee }).unwrap();
          payload.identifier.related_party_id = nomineeDetails[selectedIndex].id;
          await patchIdentifierApi({
            id: nomineeDetails[selectedIndex].identifier[0].id,
            payload: payload.identifier,
          }).unwrap();
        } else {
          const res = await postRelatedPartyApi({ investorId: undefined, payload: payload.nominee }).unwrap();
          payload.identifier.related_party_id = res.data.id;
          await postIdentifierApi({ investorId: undefined, payload: payload.identifier }).unwrap();
        }

        closeNewModal();
      } catch (e) {
        console.log("e", e);
        // pass
      }
    },
    [
      patchRelatedPartyApi,
      closeNewModal,
      postRelatedPartyApi,
      nomineeDetails,
      selectedIndex,
      patchIdentifierApi,
      postIdentifierApi,
    ]
  );

  useEffect(() => {
    if (selectedIndex === -1) return;
    updateInvestorForm(investorProfile, setValue, "NOMINEE", selectedIndex);
    openNewModal();
  }, [selectedIndex, openNewModal, setValue, investorProfile]);

  return (
    <CustomCard>
      <FlexRow justifyContent="space-between">
        <Typography align="left" size="5" weight="medium">
          Nominees
        </Typography>
        <Button
          variant="soft"
          onPress={openNewModal}
          disabled={isDisabled || nomineeDetails.length >= 3}
          title="Add New Nominee"
          icon={<AntDesign name="plus" size={18} color={themeColor.accent[11]} />}
        />
      </FlexRow>
      <Padding height={24} />
      {nomineeDetails.length === 0 ? (
        <EmptyResult style={{ minHeight: 200 }} />
      ) : (
        <FlexRow offset={8} alignItems="stretch">
          {nomineeDetails.map((val: any, i: number) => (
            <Column col={colSize} offset={8} key={i}>
              <NomineeRow data={val} index={i} handleEditClick={handleEditClick} isDisabled={isDisabled} />
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
        title={selectedIndex !== -1 ? "Update Nominee" : "Add Nominee"}
        primaryBtnProps={{
          disabled: isPostingRelatedParty || isPatchingRelatedParty || isPostingIdentifier || isPatchingIdentifier,
          loading: isPostingRelatedParty || isPatchingRelatedParty || isPostingIdentifier || isPatchingIdentifier,
        }}
      >
        <ControlledInput
          label="First Name"
          name="nominee.first_name"
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
          name="nominee.middle_name"
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
          name="nominee.last_name"
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

        <DatePicker
          control={control}
          placeholder="DD/MM/YYYY"
          name="nominee.date_of_birth"
          label="Date of Birth"
          rules={{
            required: {
              value: true,
              message: "Please enter a date of birth",
            },
          }}
        />
        <Padding height={16} />

        <ControlledDropDown
          key="identity_type"
          label="Nominee Identity Type"
          name="nominee.identity_type"
          control={control}
          options={nomineeIdentityTypeOptions}
          placeholder="Select Identity type"
          rules={{
            required: {
              value: true,
              message: "Please select identity type",
            },
          }}
        />

        <Padding height={16} />
        {identityType.value === "PAN" ? (
          <ControlledInput
            key="nominee.pan"
            label="Nominee Pan Number"
            name="nominee.pan"
            control={control}
            placeholder="Enter pan number"
            rules={{
              required: {
                value: true,
                message: "Please enter a valid PAN number",
              },
              pattern: {
                value: panNumberRegex,
                message: "Please enter a valid pan number",
              },
              minLength: {
                value: 10,
                message: "Please enter a valid pan number",
              },
              maxLength: {
                value: 10,
                message: "Please enter a valid pan number",
              },
            }}
          />
        ) : null}
        {identityType.value === "AADHAR_CARD" ? (
          <ControlledInput
            key="adhaar"
            label="Nominee Last Four Digit of Adhaar Number"
            name="nominee.adhaar"
            control={control}
            placeholder="Enter last four digit of adhaar number"
            rules={{
              required: {
                value: true,
                message: "Please enter valid four digit number",
              },
              pattern: {
                value: numberRegex,
                message: "Please enter valid four digit number",
              },
              minLength: {
                value: 4,
                message: "Please enter valid four digit number",
              },
              maxLength: {
                value: 4,
                message: "Please enter valid four digit number",
              },
            }}
          />
        ) : null}
        {identityType.value === "DRIVING_LICENSE" ? (
          <ControlledInput
            key="driving_license"
            label="Nominee Driving License Number"
            name="nominee.driving_license"
            control={control}
            placeholder="Enter Driving License number"
            rules={{
              required: {
                value: true,
                message: "Please enter a Driving License number",
              },
              pattern: {
                value: numberRegex,
                message: "Please enter a Driving License number",
              },
            }}
          />
        ) : null}

        <Padding height={16} />

        <ControlledDropDown
          label="Relationship"
          name="nominee.relationship"
          control={control}
          placeholder="Select relationship"
          options={relationShipOptions}
          rules={{
            required: {
              value: true,
              message: "Please select a relationship",
            },
          }}
        />
        <Padding height={16} />

        <ControlledInput
          label="Nomination Percent"
          name="nominee.nomination_percent"
          control={control}
          placeholder="Enter nomination percentage"
          inputMode="numeric"
          keyboardType="number-pad"
          rules={{
            required: {
              value: true,
              message: "Please enter nomination percentage",
            },
          }}
        />
        <Padding height={16} />

        <ControlledInput
          label="Email"
          name="nominee.email"
          control={control}
          placeholder="Enter email address"
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
          label="Mobile"
          name="nominee.mobile"
          control={control}
          placeholder="Enter mobile number"
          inputMode="numeric"
          keyboardType="number-pad"
          rules={{
            required: {
              value: true,
              message: "Please enter mobile number",
            },
            pattern: {
              value: numberRegex,
              message: "Please enter a valid mobile number",
            },
          }}
        />
        <Padding height={16} />

        <ControlledInput
          label="Address Line 1"
          name="nominee.line1"
          control={control}
          placeholder="Enter address line 1"
          rules={{
            required: {
              value: true,
              message: "Please enter address line 1",
            },
            maxLength: {
              value: 40,
              message: "Please enter less than 40 characters",
            },
          }}
        />
        <Padding height={16} />

        <ControlledInput
          label="Address Line 2"
          name="nominee.line2"
          control={control}
          placeholder="Enter address line 2"
          rules={{
            maxLength: {
              value: 40,
              message: "Please enter less than 40 characters",
            },
          }}
        />
        <Padding height={16} />

        <ControlledInput
          label="Address Line 3"
          name="nominee.line3"
          control={control}
          placeholder="Enter address line 3"
          rules={{
            maxLength: {
              value: 40,
              message: "Please enter less than 40 characters",
            },
          }}
        />

        <Padding height={16} />

        <ControlledDropDown
          label="Country"
          name="nominee.country"
          control={control}
          options={countryOptions}
          placeholder="Select country"
        />

        <Padding height={16} />

        <ControlledDropDown
          label="State"
          name="nominee.state"
          control={control}
          options={stateOptions}
          placeholder="Select state"
        />

        <Padding height={16} />

        <ControlledInput
          label="City"
          name="nominee.city"
          control={control}
          placeholder="Enter city"
          rules={{
            required: {
              value: true,
              message: "Please enter city",
            },
            maxLength: {
              value: 35,
              message: "Please enter less than 35 characters",
            },
          }}
        />
        <Padding height={16} />

        <ControlledInput
          label="Postal Code"
          name="nominee.postal_code"
          control={control}
          placeholder="Enter postal code"
          inputMode="numeric"
          keyboardType="number-pad"
          rules={{
            required: {
              value: true,
              message: "Please enter a valid postal code",
            },
            pattern: {
              value: numberRegex,
              message: "Please enter a valid postal code",
            },
          }}
        />
      </CustomModal>
    </CustomCard>
  );
}

export default React.memo(NomineeTab);
