import React from "react";
import { Control } from "react-hook-form";

import {
  countryOptions,
  incomeSlabOptions,
  numberRegex,
  occupationOptions,
  pepDetailsOptions,
  sourceOfWealthOptions,
  stateOptions,
  taxStatusOptions,
} from "@niveshstar/constant";
import { ControlledDropDown, ControlledInput, ControlledRadio, Padding, Typography } from "@niveshstar/ui";

interface PropsType {
  data: any;
  currStep: number;
  control: Control<any>;
}

function PersonalQuestion(props: PropsType) {
  const { currStep, control, data } = props;

  const taxStatus = data.tax_status;

  switch (currStep) {
    case 0:
      return (
        <>
          <ControlledDropDown
            key="occupation"
            label="Occupation"
            name="occupation"
            placeholder="Start typing to search"
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
          <Padding height={16} />
          <ControlledDropDown
            key="income_slab"
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
          <Padding height={16} />
          <ControlledDropDown
            key="tax_status"
            label="Tax Status"
            name="tax_status"
            placeholder="Start typing to search"
            control={control}
            options={taxStatusOptions}
            rules={{
              required: {
                value: true,
                message: "Please select tax status",
              },
            }}
          />
        </>
      );

    case 1:
      return (
        <>
          <ControlledRadio
            key="pep_details"
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
          {/* <Padding height={16} />
          <ControlledRadio
            key="marital_status"
            label="Marital Status"
            name="marital_status"
            control={control}
            options={martialStatusOptions}
            rules={{
              required: {
                value: true,
                message: "Please select a value for marital status",
              },
            }}
          /> */}
          <Padding height={16} />
          <ControlledDropDown
            key="country_of_birth"
            label="Country of birth"
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

          <Padding height={16} />
          <ControlledInput
            key="place_of_birth"
            label="Place of Birth"
            name="place_of_birth"
            control={control}
            placeholder="Place of Birth"
            rules={{
              required: {
                value: true,
                message: "Please enter place of birth",
              },
              maxLength: {
                value: 60,
                message: "Please enter less than 60 characters",
              },
            }}
          />

          {taxStatus === "NRE" || taxStatus === "NRO" ? (
            <>
              <Padding height={16} />
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

              <Padding height={16} />
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
            </>
          ) : null}
        </>
      );

    case 2:
      return (
        <>
          {taxStatus === "NRE" || taxStatus === "NRO" ? (
            <>
              <Typography align="left" size="5" weight="medium">
                Foreign Address
              </Typography>
              <Padding height={24} />
            </>
          ) : null}
          <ControlledInput
            key="address.line1"
            label="Address Line 1"
            name="address.line1"
            control={control}
            placeholder="Address Line 1"
            rules={{
              required: {
                value: true,
                message: "Please enter adress line 1",
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
            key="address.line2"
            label="Address Line 2"
            name="address.line2"
            control={control}
            placeholder="Address Line 2"
            rules={{
              required: {
                value: false,
                message: "Please enter adress line 2",
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

          {/* <Padding height={16} />
          <ControlledDropDown
            key="address.country"
            label="Country"
            name="address.country"
            control={control}
            placeholder="Start typing to search"
            options={countryOptions}
            rules={{
              required: {
                value: true,
                message: "Please select country",
              },
            }}
          /> */}

          <Padding height={16} />
          {taxStatus === "NRE" || taxStatus === "NRO" ? (
            <ControlledInput
              key="address.foreign_state"
              label="State"
              name="address.foreign_state"
              control={control}
              placeholder="Enter state"
              rules={{
                required: {
                  value: true,
                  message: "Please enter state",
                },
              }}
            />
          ) : (
            <ControlledDropDown
              key="address.state"
              label="State"
              name="address.state"
              control={control}
              placeholder="Start typing to search"
              options={stateOptions}
              rules={{
                required: {
                  value: true,
                  message: "Please select state",
                },
              }}
            />
          )}

          <Padding height={16} />
          <ControlledInput
            key="address.city"
            label="City"
            name="address.city"
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
          {taxStatus === "NRE" || taxStatus === "NRO" ? (
            <ControlledDropDown
              key="address.country"
              label="Country"
              name="address.country"
              control={control}
              placeholder="Start typing to search"
              options={countryOptions}
              rules={{
                required: {
                  value: true,
                  message: "Please select country",
                },
              }}
            />
          ) : (
            <ControlledInput
              key="address.postal_code"
              label="PIN Code"
              name="address.postal_code"
              control={control}
              placeholder="Enter PIN Code"
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
          )}

          {/* <Padding height={16} />
          <ControlledDropDown
            key="address.type"
            label="Address Type"
            name="address.type"
            control={control}
            placeholder="Start typing to search"
            options={addressTypeOptions}
            rules={{
              required: {
                value: true,
                message: "Please select address type",
              },
            }}
          /> */}
        </>
      );

    default:
      return <></>;
  }
}

export default React.memo(PersonalQuestion);
