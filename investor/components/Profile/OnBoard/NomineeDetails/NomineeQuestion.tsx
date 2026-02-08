import React, { useCallback } from "react";
import { Control } from "react-hook-form";

import {
  countryOptions,
  emailRegex,
  nomineeIdentityTypeOptions,
  numberRegex,
  panNumberRegex,
  phoneRegex,
  relationShipOptions,
  stateOptions,
} from "@niveshstar/constant";
import {
  Button,
  ControlledDropDown,
  ControlledInput,
  DatePicker,
  Divider,
  FlexRow,
  Padding,
  Typography,
} from "@niveshstar/ui";

interface PropsType {
  data: any;
  control: Control<any>;
  identityType: { value: string; name: string };
  setValue: (name: string, value: any) => void;
}

export default function NomineeQuestion(props: PropsType) {
  const { control, identityType, data, setValue } = props;

  const handleAddressCopy = useCallback(() => {
    setValue("nominee.line1", data?.address?.line1);
    setValue("nominee.line2", data?.address?.line2 || "");
    setValue("nominee.line3", data?.address?.line3 || "");
    setValue("nominee.city", data?.address?.city || "");

    const nomineeState = stateOptions.filter((item) => item.value === data?.address?.state);
    if (nomineeState.length) setValue("nominee.state", nomineeState[0]);

    const nomineeCountry = countryOptions.filter((item) => item.value === data?.address?.country);
    if (nomineeCountry.length) setValue("nominee.country", nomineeCountry[0]);

    if (data.tax_status === "INDIVIDUAL") {
      setValue("nominee.postal_code", data?.address?.postal_code);
    }
  }, [data, setValue]);

  return (
    <>
      <ControlledInput
        key="name"
        label="Name"
        name="nominee.name"
        control={control}
        placeholder="Enter name of nominee"
        rules={{
          required: {
            value: true,
            message: "Please enter name",
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
        key="relationship"
        label="Relation with nominee"
        name="nominee.relationship"
        control={control}
        options={relationShipOptions}
        placeholder="Select relationship with nominee"
        rules={{
          required: {
            value: true,
            message: "Please select a relationship",
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
          key="pan"
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
      <ControlledInput
        key="email"
        label="Nominee Email"
        name="nominee.email"
        control={control}
        placeholder="Enter Nominee Email Address"
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
        key="phone"
        label="Nominee Phone Number"
        name="nominee.mobile"
        control={control}
        placeholder="Enter Nominee Phone Number"
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

      {/* <Padding height={16} />
      <ControlledInput
        key="nomination_percent"
        label="Nomination Percentage"
        name="nominee.nomination_percent"
        control={control}
        placeholder="Enter Nomination Percentage"
        rules={{
          required: {
            value: true,
            message: "Please enter nomination percentage",
          },
          min: {
            value: 0,
            message: "Please enter a number greater than 0",
          },
          max: {
            value: 100,
            message: "Please enter a number less than 100",
          },
        }}
      /> */}

      <Padding height={16} />
      <Divider />
      <Padding height={16} />

      <FlexRow alignItems="center" justifyContent="space-between">
        <Typography size="3" weight="medium">
          Nominee's Address Details
        </Typography>
        <Button
          title="Copy Address"
          disabled={!data.address}
          onPress={handleAddressCopy}
          typographyProps={{ size: "1" }}
        />
      </FlexRow>
      <Padding height={24} />

      <ControlledInput
        key="line1"
        label="Address Line 1"
        name="nominee.line1"
        control={control}
        placeholder="Enter Nominee Address Line 1"
        rules={{
          required: {
            value: true,
            message: "Please enter nominee address line 1",
          },
          minLength: {
            value: 10,
            message: "Please enter more than 10 characters",
          },
          maxLength: {
            value: 120,
            message: "Please enter less than 120 characters",
          },
        }}
      />

      <Padding height={16} />
      <ControlledInput
        key="line2"
        label="Address Line 2"
        name="nominee.line2"
        control={control}
        placeholder="Enter Nominee Address Line 2"
        rules={{
          minLength: {
            value: 10,
            message: "Please enter more than 10 characters",
          },
          maxLength: {
            value: 120,
            message: "Please enter less than 120 characters",
          },
        }}
      />

      <Padding height={16} />
      <ControlledInput
        key="line3"
        label="Address Line 3"
        name="nominee.line3"
        control={control}
        placeholder="Enter Nominee Address Line 3"
        rules={{
          minLength: {
            value: 10,
            message: "Please enter more than 10 characters",
          },
          maxLength: {
            value: 120,
            message: "Please enter less than 120 characters",
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
        key="postal_code"
        label="Pincode"
        name="nominee.postal_code"
        control={control}
        placeholder="Enter Pincode"
        inputMode="numeric"
        keyboardType="number-pad"
        rules={{
          required: {
            value: true,
            message: "Please enter a valid 6 digit number",
          },
          pattern: {
            value: numberRegex,
            message: "Please enter a valid 6 digit number",
          },
          minLength: {
            value: 6,
            message: "Please enter a valid 6 digit number",
          },
          maxLength: {
            value: 6,
            message: "Please enter a valid 6 digit number",
          },
        }}
      />

      <Padding height={16} />
      <ControlledInput
        key="city"
        label="City"
        name="nominee.city"
        control={control}
        placeholder="Enter City"
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
    </>
  );
}
