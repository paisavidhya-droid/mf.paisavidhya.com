import React, { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";

import { addressTypeOptions, countryOptions, numberRegex, stateOptions } from "@niveshstar/constant";
import { ThemeContext, usePatchAddressMutation, usePostAddressMutation } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import Button from "../../Button";
import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import { getInvestorPayload } from "../payload";
import { updateInvestorForm } from "../util";

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

function AddressDetails(props: PropsType) {
  const { investorProfile } = props;
  const address = investorProfile?.address ?? null;

  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);
  const [postAddressApi, { isLoading: isPostingAddress }] = usePostAddressMutation();
  const [patchAddressApi, { isLoading: isPatchingAddress }] = usePatchAddressMutation();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);
  const handleCancelClick = useCallback(() => {
    setIsEditing(false);
  }, []);

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = await getInvestorPayload(data, "ADDRESS");

        if (address) await patchAddressApi({ id: address.id, payload: payload.address }).unwrap();
        else await postAddressApi({ investorId: params.investorId, payload: payload.address }).unwrap();

        handleCancelClick();
      } catch {
        // pass
      }
    },
    [patchAddressApi, handleCancelClick, postAddressApi, address, params]
  );

  useEffect(() => {
    updateInvestorForm(investorProfile, setValue, "ADDRESS");
  }, [investorProfile, setValue]);

  return (
    <View style={{ zIndex: 3 }}>
      {isEditing ? (
        <>
          <ControlledInput
            label="Address Line 1"
            name="address.line1"
            control={control}
            placeholder="Address Line 1"
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
          <Padding height={16} />

          <ControlledInput
            label="Address Line 2"
            name="address.line2"
            control={control}
            placeholder="Address Line 2"
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
            name="address.line3"
            control={control}
            placeholder="Address Line 3"
            rules={{
              maxLength: {
                value: 40,
                message: "Please enter less than 40 characters",
              },
            }}
          />

          <Padding height={16} />

          <ControlledDropDown
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

          <Padding height={16} />

          <ControlledInput
            label="City"
            name="address.city"
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

          <Padding height={16} />

          <ControlledInput
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

          <Padding height={16} />

          <ControlledDropDown
            label="Country"
            name="address.country"
            control={control}
            options={countryOptions}
            placeholder="Start typing to search"
            rules={{
              required: {
                value: true,
                message: "Please enter country",
              },
            }}
          />

          <Padding height={16} />

          <ControlledDropDown
            label="Type"
            name="address.type"
            control={control}
            options={addressTypeOptions}
            placeholder="Select address type"
            rules={{
              required: {
                value: true,
                message: "Please enter address type",
              },
            }}
          />

          <Padding height={16} />

          <FlexRow justifyContent="flex-end" colGap={8}>
            <Button
              title="Cancel"
              variant="soft"
              color="neutral"
              onPress={handleCancelClick}
              disabled={isPatchingAddress || isPostingAddress}
            />
            <Button
              title="Save"
              onPress={handleSubmit(onSubmit)}
              loading={isPatchingAddress || isPostingAddress}
              disabled={isPatchingAddress || isPostingAddress}
            />
          </FlexRow>
        </>
      ) : (
        <>
          <FlexRow justifyContent="space-between">
            <Typography size="5" weight="medium">
              Address Details
            </Typography>
            <Button
              variant="soft"
              title={address ? "Edit" : "Add"}
              onPress={handleEditClick}
              disabled={Boolean(investorProfile.client_code)}
            />
          </FlexRow>
          <Padding height={16} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Line 1:&nbsp;
            </Typography>
            <Typography size="1">{address?.line1 || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Line 2:&nbsp;
            </Typography>
            <Typography size="1">{address?.line2 || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Line 3:&nbsp;
            </Typography>
            <Typography size="1">{address?.line3 || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              State:&nbsp;
            </Typography>
            <Typography size="1">
              {address?.state && typeof address.state === "string"
                ? stateOptions.find((s) => s.value === address.state)?.name || address.state
                : address?.state?.name || address?.state || "-"}
            </Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              City:&nbsp;
            </Typography>
            <Typography size="1">{address?.city || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              PIN:&nbsp;
            </Typography>
            <Typography size="1">{address?.postal_code || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Country:&nbsp;
            </Typography>
            <Typography size="1">
              {address?.country && typeof address.country === "string"
                ? countryOptions.find((c) => c.value === address.country)?.name || address.country
                : address?.country?.name || address?.country || "-"}
            </Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Type:&nbsp;
            </Typography>
            <Typography size="1">{address?.type?.name || address?.type || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
        </>
      )}
    </View>
  );
}

export default React.memo(AddressDetails);
