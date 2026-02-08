import React, { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import moment from "moment";
import { useForm } from "react-hook-form";

import {
  countryOptions,
  emailRegex,
  nameRegex,
  nomineeIdentityTypeOptions,
  numberRegex,
  panNumberRegex,
  relationShipOptions,
  stateOptions,
} from "@niveshstar/constant";
import {
  ThemeContext,
  usePatchIdentifierMutation,
  usePatchRelatedPartyMutation,
  usePostIdentifierMutation,
  usePostRelatedPartyMutation,
} from "@niveshstar/context";
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
  nominee: {
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    relationship: { name: "", value: "" },
    nomination_percent: "100",
    identity_type: { value: "", name: "" },
    pan: "",
    adhaar: "",
    driving_license: "",
    email: "",
    mobile: "",
    line1: "",
    line2: "",
    line3: "",
    city: "",
    state: { name: "", value: "" },
    postal_code: "",
    country: { name: "", value: "" },
  },
};

function NomineeDetails(props: PropsType) {
  const { investorProfile } = props;
  const nominee = investorProfile?.related_party?.[0] ?? null;

  const { params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);

  const [postIdentifierApi, { isLoading: isPostingIdentifier }] = usePostIdentifierMutation();
  const [patchIdentifierApi, { isLoading: isPatchingIdentifier }] = usePatchIdentifierMutation();
  const [postRelatedPartyApi, { isLoading: isPostingRelatedParty }] = usePostRelatedPartyMutation();
  const [patchRelatedPartyApi, { isLoading: isPatchingRelatedParty }] = usePatchRelatedPartyMutation();

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const identityType = watch("nominee.identity_type");

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);
  const handleCancelClick = useCallback(() => {
    setIsEditing(false);
  }, []);

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = await getInvestorPayload(data, "NOMINEE");

        if (nominee) {
          await patchRelatedPartyApi({ id: nominee.id, payload: payload.nominee }).unwrap();

          payload.identifier.related_party_id = nominee.id;
          await patchIdentifierApi({ id: nominee.identifier[0].id, payload: payload.identifier }).unwrap();
        } else {
          const res = await postRelatedPartyApi({ investorId: params.investorId, payload: payload.nominee }).unwrap();

          payload.identifier.related_party_id = res.data.id;
          await postIdentifierApi({ investorId: params.investorId, payload: payload.identifier }).unwrap();
        }

        handleCancelClick();
      } catch {
        // pass
      }
    },
    [
      patchRelatedPartyApi,
      handleCancelClick,
      postRelatedPartyApi,
      nominee,
      params,
      patchIdentifierApi,
      postIdentifierApi,
    ]
  );

  useEffect(() => {
    if (!investorProfile) return;
    updateInvestorForm(investorProfile, setValue, "NOMINEE");
  }, [investorProfile, setValue]);

  return (
    <View>
      {isEditing ? (
        <>
          <ControlledInput
            label="First Name"
            name="nominee.first_name"
            control={control}
            placeholder="Enter first name"
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
            label="Middle Name"
            name="nominee.middle_name"
            control={control}
            placeholder="Enter middle name"
            rules={{
              pattern: {
                value: nameRegex,
                message: "Please enter a valid name",
              },
            }}
          />
          <Padding height={16} />

          <ControlledInput
            label="Last Name"
            name="nominee.last_name"
            control={control}
            placeholder="Enter last name"
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
              key="nominee.pan"
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

          <ControlledDropDown
            label="Relationship"
            name="nominee.relationship"
            control={control}
            placeholder="Select relationship"
            options={relationShipOptions}
            rules={{
              required: {
                value: true,
                message: "Please select a relationship",
              },
            }}
          />
          <Padding height={16} />

          <ControlledInput
            label="Nomination Percent"
            name="nominee.nomination_percent"
            control={control}
            placeholder="Enter nomination percentage"
            inputMode="numeric"
            keyboardType="number-pad"
            rules={{
              required: {
                value: true,
                message: "Please enter nomination percentage",
              },
            }}
          />
          <Padding height={16} />

          <ControlledInput
            label="Email"
            name="nominee.email"
            control={control}
            placeholder="Enter email address"
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
            label="Mobile"
            name="nominee.mobile"
            control={control}
            placeholder="Enter mobile number"
            inputMode="numeric"
            keyboardType="number-pad"
            rules={{
              required: {
                value: true,
                message: "Please enter mobile number",
              },
              pattern: {
                value: numberRegex,
                message: "Please enter a valid mobile number",
              },
            }}
          />
          <Padding height={16} />

          <ControlledInput
            label="Address Line 1"
            name="nominee.line1"
            control={control}
            placeholder="Enter address line 1"
            rules={{
              required: {
                value: true,
                message: "Please enter address line 1",
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
            name="nominee.line2"
            control={control}
            placeholder="Enter address line 2"
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
            name="nominee.line3"
            control={control}
            placeholder="Enter address line 3"
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
            name="nominee.state"
            control={control}
            options={stateOptions}
            placeholder="Select state"
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

          <ControlledInput
            label="City"
            name="nominee.city"
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

          <ControlledInput
            label="Postal Code"
            name="nominee.postal_code"
            control={control}
            placeholder="Enter postal code"
            inputMode="numeric"
            keyboardType="number-pad"
            rules={{
              required: {
                value: true,
                message: "Please enter a valid postal code",
              },
              pattern: {
                value: numberRegex,
                message: "Please enter a valid postal code",
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
              disabled={isPatchingRelatedParty || isPostingRelatedParty || isPostingIdentifier || isPatchingIdentifier}
            />
            <Button
              title="Save"
              onPress={handleSubmit(onSubmit)}
              disabled={isPatchingRelatedParty || isPostingRelatedParty || isPostingIdentifier || isPatchingIdentifier}
              loading={isPatchingRelatedParty || isPostingRelatedParty || isPostingIdentifier || isPatchingIdentifier}
            />
          </FlexRow>
        </>
      ) : (
        <>
          <FlexRow justifyContent="space-between">
            <Typography size="5" weight="medium">
              Nominee Details
            </Typography>
            <Button
              variant="soft"
              title={nominee ? "Edit" : "Add"}
              onPress={handleEditClick}
              disabled={Boolean(investorProfile.client_code)}
            />
          </FlexRow>
          <Padding height={16} />

          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              First Name:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.first_name || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Middle Name:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.middle_name || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Last Name:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.last_name || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              DOB:&nbsp;
            </Typography>
            <Typography size="1">
              {nominee?.date_of_birth ? moment(nominee.date_of_birth).format("D MMMM YYYY") : "-"}
            </Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Relationship:&nbsp;
            </Typography>
            <Typography size="1">
              {nominee?.relationship && typeof nominee.relationship === "string"
                ? relationShipOptions.find((val) => val.value === nominee.relationship)?.name || nominee.relationship
                : "-"}
            </Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Nomination Percent:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.nomination_percent || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Email:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.email || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Mobile:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.mobile || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Line 1:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.line1 || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Line 2:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.line2 || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Line 3:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.line3 || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              City:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.city || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              State:&nbsp;
            </Typography>
            <Typography size="1">
              {nominee?.state && typeof nominee.state === "string"
                ? stateOptions.find((val) => val.value === nominee.state)?.name || nominee.state
                : "-"}
            </Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Postal Code:&nbsp;
            </Typography>
            <Typography size="1">{nominee?.postal_code || "-"}</Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Country:&nbsp;
            </Typography>
            <Typography size="1">
              {nominee?.country && typeof nominee.country === "string"
                ? countryOptions.find((val) => val.value === nominee.country)?.name || nominee.country
                : "-"}
            </Typography>
          </FlexRow>
          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Identifier:&nbsp;
            </Typography>
            <Typography size="1">
              {nominee?.identifier.length
                ? nomineeIdentityTypeOptions.find((val) => val.value === nominee.identifier[0].identifier_type)?.name ||
                  nominee.identifier[0].identifier_type
                : "-"}
            </Typography>
          </FlexRow>

          <Padding height={8} />
          <FlexRow>
            <Typography size="1" color={themeColor.gray[11]} weight="medium">
              Identifier Number:&nbsp;
            </Typography>
            <Typography size="1">
              {nominee?.identifier.length ? nominee?.identifier[0].identifier_number : "-"}
            </Typography>
          </FlexRow>
        </>
      )}
    </View>
  );
}

export default React.memo(NomineeDetails);
