import React, { useCallback, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { addressTypeOptions, countryOptions, numberRegex, stateOptions } from "@niveshstar/constant";
import { RootStateType, ScreenContext, usePatchAddressMutation } from "@niveshstar/context";
import {
  Button,
  Column,
  ControlledDropDown,
  ControlledInput,
  CustomCard,
  FlexRow,
  getInvestorPayload,
  Padding,
  Typography,
  updateInvestorForm,
} from "@niveshstar/ui";

interface PropsType {
  investorProfile: any;
}

const defaultValues = {
  address: {
    line1: "",
    line2: "",
    line3: "",
    postal_code: "",
    city: "",
    state: { name: "", value: "" },
    country: { name: "", value: "" },
    type: { name: "", value: "" },
  },
};

function AddressTab(props: PropsType) {
  const { investorProfile } = props;

  const address = investorProfile?.address ?? null;

  const { screenType } = useContext(ScreenContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);
  const isDisabled = Boolean(authDetail.uccRegistered);

  const colSize = screenType === "sm" ? 24 : screenType === "md" ? 12 : 8;

  const [patchAddressApi, { isLoading: isPatchingAddress }] = usePatchAddressMutation();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = await getInvestorPayload(data, "ADDRESS");
        await patchAddressApi({ id: address.id, payload: payload.address }).unwrap();
      } catch {
        // pass
      }
    },
    [patchAddressApi, address]
  );

  useEffect(() => {
    updateInvestorForm(investorProfile, setValue, "ADDRESS");
  }, [investorProfile, setValue]);

  return (
    <CustomCard>
      <Typography align="left" size="5" weight="medium">
        Address Details
      </Typography>
      <Padding height={24} />

      <FlexRow rowGap={16} offset={8} wrap style={{ zIndex: 1 }}>
        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            disabled={isDisabled}
            control={control}
            name="address.line1"
            placeholder="Address Line 1"
            label="Address Line 1"
            rules={{
              required: {
                value: true,
                message: "Please enter adress line 1",
              },
              maxLength: {
                value: 40,
                message: "Please enter less than 40 characters",
              },
            }}
          />
        </Column>
        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            disabled={isDisabled}
            control={control}
            name="address.line2"
            placeholder="Address Line 2"
            label="Address Line 2"
            rules={{
              required: {
                value: false,
                message: "Please enter adress line 2",
              },
              maxLength: {
                value: 40,
                message: "Please enter less than 40 characters",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            label="Address Line 3"
            name="address.line3"
            disabled={isDisabled}
            control={control}
            placeholder="Address Line 3"
            rules={{
              maxLength: {
                value: 40,
                message: "Please enter less than 40 characters",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 3 }}>
          <ControlledDropDown
            disabled={isDisabled}
            control={control}
            name="address.state"
            label="State"
            placeholder="Start typing to search"
            options={stateOptions}
            rules={{
              required: {
                value: true,
                message: "Please select state",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 2 }}>
          <ControlledDropDown
            label="Country"
            name="address.country"
            control={control}
            disabled={isDisabled}
            options={countryOptions}
            placeholder="Start typing to search"
            rules={{
              required: {
                value: true,
                message: "Please enter country",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 1 }}>
          <ControlledDropDown
            label="Type"
            name="address.type"
            control={control}
            disabled={isDisabled}
            options={addressTypeOptions}
            placeholder="Select address type"
            rules={{
              required: {
                value: true,
                message: "Please enter address type",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            disabled={isDisabled}
            control={control}
            name="address.city"
            placeholder="Enter City"
            label="City"
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
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            disabled={isDisabled}
            control={control}
            name="address.postal_code"
            placeholder="Enter PIN Code"
            label="PIN Code"
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
        </Column>
      </FlexRow>

      <FlexRow>
        <Button
          title="Save"
          loading={isPatchingAddress}
          onPress={handleSubmit(onSubmit)}
          disabled={isDisabled || isPatchingAddress}
        />
      </FlexRow>
    </CustomCard>
  );
}

export default React.memo(AddressTab);
