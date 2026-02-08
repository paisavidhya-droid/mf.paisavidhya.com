import React, { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import moment from "moment";
import { useForm } from "react-hook-form";

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
import { ThemeContext, usePatchInvestorProfileMutation } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import Button from "../../Button";
import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import DatePicker from "../../DatePicker";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import { getInvestorPayload } from "../payload";
import { updateInvestorForm } from "../util";

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
};

function PersonalDetails(props: PropsType) {
  const { investorProfile } = props;

  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);
  const [patchInvestorProfileApi, { isLoading: isPatchingInvestorProfile }] = usePatchInvestorProfileMutation();

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
        const payload = await getInvestorPayload(data, "PERSONAL_DETAILS");

        await patchInvestorProfileApi({ investorId: params.investorId, payload: payload.personal_details }).unwrap();

        handleCancelClick();
      } catch {
        //pass
      }
    },
    [patchInvestorProfileApi, handleCancelClick, params]
  );

  useEffect(() => {
    if (!investorProfile) return;
    updateInvestorForm(investorProfile, setValue, "PERSONAL");
  }, [investorProfile, setValue]);

  return (
    <View>
      {isEditing ? (
        <>
          <ControlledInput
            name="first_name"
            control={control}
            placeholder="First Name"
            label="First Name"
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
            name="middle_name"
            control={control}
            placeholder="Middle Name"
            label="Middle Name"
            rules={{
              pattern: {
                value: nameRegex,
                message: "Please enter a valid name",
              },
            }}
          />

          <Padding height={16} />

          <ControlledInput
            name="last_name"
            control={control}
            placeholder="Last Name"
            label="Last Name"
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

          <ControlledDropDown
            control={control}
            name="gender"
            label="Gender"
            options={genderOptions}
            rules={{
              required: {
                value: true,
                message: "Please select a gender",
              },
            }}
          />

          <Padding height={16} />

          <ControlledInput
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

          <Padding height={16} />

          <DatePicker
            control={control}
            name="date_of_birth"
            placeholder="Date of birth"
            label="Date of birth"
            rules={{
              required: {
                value: true,
                message: "Please enter date of birth",
              },
            }}
          />

          <Padding height={16} />

          <ControlledDropDown
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

          <Padding height={16} />

          <ControlledInput
            control={control}
            name="place_of_birth"
            placeholder="Place of Birth"
            label="Place of Birth"
            rules={{
              required: {
                value: true,
                message: "Please enter place of birth",
              },
            }}
          />

          <Padding height={16} />

          <ControlledDropDown
            control={control}
            name="country_of_birth"
            label="Country of Birth"
            options={countryOptions}
            placeholder="Start typing to search"
            rules={{
              required: {
                value: true,
                message: "Please select country of birth",
              },
            }}
          />

          <Padding height={16} />

          <ControlledDropDown
            control={control}
            name="source_of_wealth"
            label="Source of Wealth"
            options={sourceOfWealthOptions}
            placeholder="Select source of wealth"
            rules={{
              required: {
                value: true,
                message: "Please select source of wealth",
              },
            }}
          />

          <Padding height={16} />

          <ControlledDropDown
            control={control}
            name="income_slab"
            label="Income Slab"
            options={incomeSlabOptions}
            placeholder="Select income slab"
            rules={{
              required: {
                value: true,
                message: "Please select income slab",
              },
            }}
          />

          <Padding height={16} />

          <ControlledDropDown
            control={control}
            name="pep_details"
            label="PEP Details"
            options={pepDetailsOptions}
            placeholder="Select PEP details"
            rules={{
              required: {
                value: true,
                message: "Please select PEP details",
              },
            }}
          />

          <FlexRow justifyContent="flex-end" colGap={8}>
            <Button
              title="Cancel"
              variant="soft"
              color="neutral"
              onPress={handleCancelClick}
              disabled={isPatchingInvestorProfile}
            />
            <Button
              title="Save"
              onPress={handleSubmit(onSubmit)}
              disabled={isPatchingInvestorProfile}
              loading={isPatchingInvestorProfile}
            />
          </FlexRow>
        </>
      ) : (
        <>
          <FlexRow justifyContent="space-between">
            <Typography size="5" weight="medium">
              Personal Details
            </Typography>
            <Button
              title="Edit"
              variant="soft"
              onPress={handleEditClick}
              disabled={Boolean(investorProfile.client_code)}
            />
          </FlexRow>
          <Padding height={16} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              First Name:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.first_name || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Middle Name:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.middle_name || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Last Name:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.last_name || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              PAN:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.pan || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Gender:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.gender || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              DOB:&nbsp;
            </Typography>
            <Typography size="1">
              {investorProfile?.date_of_birth ? moment(investorProfile.date_of_birth).format("D MMMM YYYY") : "-"}
            </Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Occupation:&nbsp;
            </Typography>
            <Typography size="1">
              {investorProfile?.occupation
                ? occupationOptions.find((val) => val.value === investorProfile.occupation)?.name || ""
                : ""}
            </Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Holding Nature:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.holding_nature || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Tax Status:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.tax_status || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Place of Birth:&nbsp;
            </Typography>
            <Typography size="1">{investorProfile?.place_of_birth || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Country of Birth:&nbsp;
            </Typography>
            <Typography size="1">
              {investorProfile?.country_of_birth
                ? countryOptions.find((val) => val.value === investorProfile.country_of_birth)?.name || ""
                : ""}
            </Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Source of Wealth:&nbsp;
            </Typography>
            <Typography size="1">
              {investorProfile?.source_of_wealth
                ? sourceOfWealthOptions.find((val) => val.value === investorProfile.source_of_wealth)?.name || ""
                : ""}
            </Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Income Slab:&nbsp;
            </Typography>
            <Typography size="1">
              {investorProfile?.income_slab
                ? incomeSlabOptions.find((val) => val.value === investorProfile.income_slab)?.name || ""
                : ""}
            </Typography>
          </FlexRow>
          <Padding height={8} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              PEP Details:&nbsp;
            </Typography>
            <Typography size="1">
              {investorProfile?.pep_details
                ? pepDetailsOptions.find((val) => val.value === investorProfile.pep_details)?.name || ""
                : ""}
            </Typography>
          </FlexRow>
          <Padding height={8} />
        </>
      )}
    </View>
  );
}

export default React.memo(PersonalDetails);
