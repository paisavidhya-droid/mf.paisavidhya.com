import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import { emailRegex, numberRegex } from "@niveshstar/constant";
import { ScreenContext } from "@niveshstar/context";
import { Column, ControlledInput, CustomCard, FlexRow, Padding, Typography, updateInvestorForm } from "@niveshstar/ui";

interface PropsType {
  investorProfile: any;
}

const defaultValues = {
  email_address: { id: "", email: "", belongs_to: "" },
  phone_number: { id: "", isd: "", number: "", belongs_to: "", type: "" },
};

function CommunicationTab(props: PropsType) {
  const { investorProfile } = props;

  const isDisabled = true;
  const { screenType } = useContext(ScreenContext);
  const colSize = screenType === "sm" ? 24 : screenType === "md" ? 12 : 8;

  const { control, setValue } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!investorProfile) return;
    updateInvestorForm(investorProfile, setValue, "COMMUNICATION");
  }, [investorProfile, setValue]);

  return (
    <CustomCard>
      <Typography align="left" size="5" weight="medium">
        Contact Details
      </Typography>
      <Padding height={24} />

      <FlexRow rowGap={16} offset={8} wrap style={{ zIndex: 1 }}>
        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            name="email_address.email"
            placeholder="johndoe@gmail.com"
            control={control}
            disabled={isDisabled}
            label="Email Address"
            inputMode="email"
            rules={{
              required: {
                value: true,
                message: "Please enter an email address",
              },
              pattern: {
                value: emailRegex,
                message: "Please enter a valid email address",
              },
            }}
          />
        </Column>

        <Column col={colSize} offset={8} style={{ zIndex: 0 }}>
          <ControlledInput
            label="Phone Number"
            name="phone_number.number"
            control={control}
            placeholder="Enter Phone Number"
            inputMode="numeric"
            disabled={isDisabled}
            keyboardType="number-pad"
            rules={{
              required: {
                value: true,
                message: "Please enter a valid 10 digit number",
              },
              pattern: {
                value: numberRegex,
                message: "Please enter a valid 10 digit number",
              },
              minLength: {
                value: 10,
                message: "Please enter a valid 10 digit number",
              },
              maxLength: {
                value: 10,
                message: "Please enter a valid 10 digit number",
              },
            }}
          />
        </Column>
      </FlexRow>
    </CustomCard>
  );
}

export default React.memo(CommunicationTab);
