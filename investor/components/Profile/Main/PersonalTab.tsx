import React, { useCallback, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import {
  countryOptions,
  genderOptions,
  incomeSlabOptions,
  nameRegex,
  occupationOptions,
  panNumberRegex,
  pepDetailsOptions,
  sourceOfWealthOptions,
} from "@niveshstar/constant";
import { RootStateType, ScreenContext, usePatchInvestorProfileMutation } from "@niveshstar/context";
import {
  Button,
  Column,
  ControlledDropDown,
  ControlledInput,
  CustomCard,
  DatePicker,
  FlexRow,
  getInvestorPayload,
  Padding,
  Typography,
  updateInvestorForm,
} from "@niveshstar/ui";
import { toastHelper } from "@niveshstar/utils";

interface PropsType {
  investorProfile: any;
}

const defaultValues = {
  first_name: "",
  middle_name: "",
  last_name: "",
  pan: "",
  gender: { name: "", value: "" },
  date_of_birth: "",
  occupation: { name: "", value: "" },
  holding_nature: "",
  tax_status: "",
  place_of_birth: "",
  country_of_birth: { name: "", value: "" },
  source_of_wealth: { name: "", value: "" },
  income_slab: { name: "", value: "" },
  pep_details: { name: "", value: "" },
  tin_no: "",
  tin_country: { name: "", value: "" },
};

function PersonalTab(props: PropsType) {
  const { investorProfile } = props;

  const { screenType } = useContext(ScreenContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);
  const isDisabled = Boolean(authDetail.uccRegistered);

  const colSize = screenType === "sm" ? 24 : screenType === "md" ? 12 : 8;

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const [patchInvestorProfileApi, { isLoading: isPatchingInvestorProfile }] = usePatchInvestorProfileMutation();

  const onSubmit = useCallback(
    async (data: any) => {
      const investorPayload = await getInvestorPayload(data, "PERSONAL_DETAILS");

      try {
        await patchInvestorProfileApi({ investorId: undefined, payload: investorPayload.personal_details }).unwrap();
        toastHelper("success", "Profile Updated!");
      } catch {
        //do nothing
      }
    },
    [patchInvestorProfileApi]
  );

  useEffect(() => {
    if (!investorProfile) return;
    updateInvestorForm(investorProfile, setValue, "PERSONAL");
  }, [investorProfile, setValue]);

  return (
    <CustomCard>
      <Typography align="left" size="5" weight="medium">
        Personal Details
      </Typography>
      <Padding height={24} />

      <FlexRow rowGap={16} offset={8} wrap style={{ zIndex: 1 }}>
        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            disabled={isDisabled}
            control={control}
            name="first_name"
            placeholder="First Name"
            label="First Name"
            rules={{
              required: {
                value: true,
                message: "Please enter first name",
              },
              pattern: {
                value: nameRegex,
                message: "Please enter a valid name",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            disabled={isDisabled}
            control={control}
            name="middle_name"
            placeholder="Middle Name"
            label="Middle Name"
            rules={{
              required: {
                value: false,
                message: "Please enter middle name",
              },
              pattern: {
                value: nameRegex,
                message: "Please enter a valid name",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            disabled={isDisabled}
            control={control}
            name="last_name"
            placeholder="Last Name"
            label="Last Name"
            rules={{
              required: {
                value: true,
                message: "Please enter last name",
              },
              pattern: {
                value: nameRegex,
                message: "Please enter a valid name",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 6 }}>
          <ControlledDropDown
            disabled={isDisabled}
            control={control}
            name="gender"
            label="Gender"
            options={genderOptions}
            placeholder="Gender"
            rules={{
              required: {
                value: true,
                message: "Please select a gender",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            disabled={isDisabled}
            control={control}
            name="pan"
            placeholder="PAN"
            label="PAN"
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
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <DatePicker
            disabled={isDisabled}
            control={control}
            name="date_of_birth"
            placeholder="Date of Birth"
            label="Date of Birth"
            rules={{
              required: {
                value: true,
                message: "Please enter date of birth",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 5 }}>
          <ControlledDropDown
            disabled={isDisabled}
            control={control}
            name="occupation"
            placeholder="Occupation"
            label="Occupation"
            options={occupationOptions}
            rules={{
              required: {
                value: true,
                message: "Please select an occupation",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 4 }}>
          <ControlledDropDown
            key="source_of_wealth"
            disabled={isDisabled}
            label="Source of wealth"
            name="source_of_wealth"
            placeholder="Start typing to search"
            control={control}
            options={sourceOfWealthOptions}
            rules={{
              required: {
                value: true,
                message: "Please select source of wealth",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 3 }}>
          <ControlledDropDown
            key="income_slab"
            disabled={isDisabled}
            label="Income Slab"
            name="income_slab"
            placeholder="Start typing to search"
            control={control}
            options={incomeSlabOptions}
            rules={{
              required: {
                value: true,
                message: "Please select income slab",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 2 }}>
          <ControlledDropDown
            key="country_of_birth"
            disabled={isDisabled}
            label="Country of Birth"
            name="country_of_birth"
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
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 2 }}>
          <ControlledDropDown
            key="tin_country"
            label="Tin Country"
            name="tin_country"
            control={control}
            placeholder="Start typing to search"
            options={countryOptions}
            rules={{
              required: {
                value: true,
                message: "Please select country of tin",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            key="tin_no"
            label="Tin Number"
            name="tin_no"
            control={control}
            placeholder="Tin number"
            rules={{
              required: {
                value: true,
                message: "Please enter tin number",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 1 }}>
          <ControlledDropDown
            key="pep_details"
            disabled={isDisabled}
            label="Are you a politically exposed person (PEP)?"
            name="pep_details"
            control={control}
            options={pepDetailsOptions}
            rules={{
              required: {
                value: true,
                message: "Please select PEP details",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            control={control}
            disabled={isDisabled}
            name="place_of_birth"
            placeholder="Place of Birth"
            label="Place of Birth"
          />
        </Column>
      </FlexRow>

      <FlexRow>
        <Button
          title="Save"
          onPress={handleSubmit(onSubmit)}
          loading={isPatchingInvestorProfile}
          disabled={isDisabled || isPatchingInvestorProfile}
        />
      </FlexRow>
    </CustomCard>
  );
}

export default React.memo(PersonalTab);
