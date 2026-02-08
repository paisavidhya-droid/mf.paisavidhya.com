import React, { useCallback, useContext } from "react";
import { useForm } from "react-hook-form";

import { ScreenContext, usePatchPasswordMutation } from "@niveshstar/context";
import { Button, Column, ControlledInput, CustomCard, FlexRow, Padding, Typography } from "@niveshstar/ui";

const defaultValues = {
  old_password: "",
  confirm_password: "",
  password: "",
};

function PasswordTab() {
  const { screenType } = useContext(ScreenContext);

  const [patchPasswordApi, { isLoading: isPatchingPassword }] = usePatchPasswordMutation();

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues,
    reValidateMode: "onSubmit",
  });

  const updatePassword = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          old_password: data.old_password,
          new_password: data.password,
        };
        await patchPasswordApi(payload).unwrap();
        reset();
      } catch {
        //do nothing
      }
    },
    [patchPasswordApi, reset]
  );

  const colSize = screenType === "sm" ? 24 : screenType === "md" ? 12 : 8;

  return (
    <CustomCard>
      <Typography align="left" size="5" weight="medium">
        Update Password
      </Typography>
      <Padding height={24} />

      <FlexRow>
        <Column col={colSize}>
          <ControlledInput
            control={control}
            placeholder="Old Password"
            label="Current Password"
            name="old_password"
            secureTextEntry
            rules={{
              required: {
                value: true,
                message: "Please enter your current password",
              },
            }}
          />
        </Column>
      </FlexRow>
      <Padding height={16} />
      <FlexRow>
        <Column col={colSize}>
          <ControlledInput
            control={control}
            placeholder="New Password"
            label="New Password"
            secureTextEntry
            name="password"
            rules={{
              required: {
                value: true,
                message: "Please enter a new password",
              },
            }}
          />
        </Column>
      </FlexRow>
      <Padding height={16} />
      <FlexRow>
        <Column col={colSize}>
          <ControlledInput
            control={control}
            placeholder="Confirm Password"
            label="Confirm Password"
            name="confirm_password"
            secureTextEntry
            rules={{
              required: {
                value: true,
                message: "Please re-enter password",
              },
              validate: (value: string) => value === getValues("password") || "Passwords do not match",
            }}
          />
        </Column>
      </FlexRow>
      <Padding height={16} />
      <FlexRow>
        <Button title="Submit" disabled={isPatchingPassword} onPress={handleSubmit(updatePassword)} />
      </FlexRow>
    </CustomCard>
  );
}

export default React.memo(PasswordTab);
