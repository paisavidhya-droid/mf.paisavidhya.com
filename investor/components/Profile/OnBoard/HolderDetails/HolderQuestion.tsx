import React from "react";
import { Control } from "react-hook-form";

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
import { ControlledDropDown, ControlledInput, DatePicker, Padding } from "@niveshstar/ui";

interface PropsType {
  holders: any[];
  control: Control<any>;
}

function HolderQuestion(props: PropsType) {
  const { control } = props;

  return (
    <>
      <ControlledInput
        name="holder.name"
        placeholder="Enter your name"
        control={control}
        label="Full Name"
        rules={{
          required: {
            value: true,
            message: "Please enter your name",
          },
          minLength: {
            value: 3,
            message: "Name must be at least 3 characters",
          },
          maxLength: {
            value: 100,
            message: "Name must be at most 100 characters",
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
    </>
  );
}

export default React.memo(HolderQuestion);