import React, { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";

import { emailRegex, numberRegex } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";

import Button from "../../Button";
import ControlledInput from "../../ControlledInput";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import { updateInvestorForm } from "../util";

interface PropsType {
  investorProfile: any;
}

const defaultValues = {
  email_address: { id: "", email: "", belongs_to: "" },
  phone_number: { id: "", isd: "", number: "", belongs_to: "", type: "" },
};

function CommunicationDetails(props: PropsType) {
  const { investorProfile } = props;

  const { themeColor } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);

  const { control, setValue } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);
  const handleCancelClick = useCallback(() => {
    setIsEditing(false);
  }, []);

  useEffect(() => {
    if (!investorProfile) return;
    updateInvestorForm(investorProfile, setValue, "COMMUNICATION");
  }, [investorProfile, setValue]);

  return (
    <View>
      {isEditing ? (
        <>
          <ControlledInput
            name="email_address.email"
            placeholder="johndoe@gmail.com"
            control={control}
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

          <Padding height={16} />

          <ControlledInput
            label="Email Belongs To"
            name="email_address.belongs_to"
            control={control}
            placeholder="Enter who email belongs to"
            rules={{
              required: {
                value: true,
                message: "Please enter email belongs to",
              },
            }}
          />

          <Padding height={16} />

          <ControlledInput
            label="Phone ISD"
            name="phone_number.isd"
            control={control}
            placeholder="Enter ISD Code"
            inputMode="numeric"
            keyboardType="number-pad"
            rules={{
              required: {
                value: true,
                message: "Please enter ISD code",
              },
            }}
          />

          <Padding height={16} />

          <ControlledInput
            label="Phone Number"
            name="phone_number.number"
            control={control}
            placeholder="Enter Phone Number"
            inputMode="numeric"
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

          <Padding height={16} />

          <ControlledInput
            label="Phone Belongs To"
            name="phone_number.belongs_to"
            control={control}
            placeholder="Enter who phone belongs to"
            rules={{
              required: {
                value: true,
                message: "Please enter phone belongs to",
              },
            }}
          />

          <Padding height={16} />

          <ControlledInput
            label="Phone Type"
            name="phone_number.type"
            control={control}
            placeholder="Enter phone type"
            rules={{
              required: {
                value: true,
                message: "Please enter phone type",
              },
            }}
          />

          <Padding height={16} />

          <FlexRow justifyContent="flex-end" colGap={8}>
            <Button title="Cancel" variant="soft" color="neutral" onPress={handleCancelClick} />
            <Button title="Save" onPress={() => {}} />
          </FlexRow>
        </>
      ) : (
        <>
          <FlexRow justifyContent="space-between">
            <Typography size="5" weight="medium">
              Communication Details
            </Typography>
            <Button
              title="Edit"
              variant="soft"
              onPress={handleEditClick}
              // disabled={Boolean(investorProfile.client_code)}
              disabled
            />
          </FlexRow>
          <Padding height={16} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Email:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.email_address?.email ?? "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Email Belongs To:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.email_address?.belongs_to ?? "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Phone ISD:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.phone_number?.isd ?? "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Phone Number:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.phone_number?.number ?? "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Phone Belongs To:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.phone_number?.belongs_to ?? "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Phone Type:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.phone_number?.type ?? "-"}</Typography>
          </FlexRow>
        </>
      )}
    </View>
  );
}

export default React.memo(CommunicationDetails);
