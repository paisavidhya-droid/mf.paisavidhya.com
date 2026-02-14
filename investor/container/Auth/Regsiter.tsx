import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { Asset } from "expo-asset";
import { AnimatePresence, MotiView } from "moti";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { emailRegex, genderOptions, nameRegex, numberRegex, panNumberRegex } from "@niveshstar/constant";
import {
  AppDispatch,
  RootStateType,
  ScreenContext,
  setAuthDetail,
  ThemeContext,
  useGetInvestorProfileQuery,
  usePatchInvestorProfileMutation,
  usePostEmailMutation,
  usePostPhoneMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import {
  Button,
  Column,
  ControlledDropDown,
  ControlledInput,
  DatePicker,
  FlexRow,
  Padding,
  Typography,
} from "@niveshstar/ui";
import { getNamesPart } from "@niveshstar/utils";

const authBackground = Asset.fromModule(require("@niveshstar/assets/img/auth-background.webp")).uri;

const defaultValues = {
  name: "",
  email: "",
  mobile: "",
  pan: "",
  gender: { name: "", value: "" },
  date_of_birth: "",
};

function Register() {
  const firstRenderRef = useRef(true);
  const { navigator } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [postEmailApi, { isLoading: isPostingEmail }] = usePostEmailMutation();
  const [postPhoneApi, { isLoading: isPostingPhone }] = usePostPhoneMutation();
  const [patchInvestorProfileApi, { isLoading: isPatchingInvestorProfile }] = usePatchInvestorProfileMutation();

  const { data: investorProfile = { data: null }, isLoading: isGettingInvestorData } = useGetInvestorProfileQuery(
    undefined,
    {
      skip: !authDetail.id,
    }
  );

  const [currStep, setCurrStep] = useState(0);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const name = watch("name");
  const pan = watch("pan");

  const isCompany = useMemo(() => {
    if (!pan || pan.length < 4) return false;
    return pan.toLowerCase()[3] === "c";
  }, [pan]);

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const { first_name, middle_name, last_name } = getNamesPart(data.name);

        const payload = {
          pan: data.pan,
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          gender: data.gender.value,
          date_of_birth: new Date(data.date_of_birth).toISOString(),
        };

        await patchInvestorProfileApi({ investorId: undefined, payload: payload }).unwrap();

        if (investorProfile?.data?.email_address === null) {
          const emailPayload = {
            email: data.email,
            belongs_to: "SELF",
          };

          await postEmailApi(emailPayload).unwrap();
        }

        if (investorProfile?.data?.phone_number === null) {
          const phonePayload = {
            isd: "+91",
            number: data.mobile,
            belongs_to: "SELF",
            type: "PRIMARY",
          };

          await postPhoneApi(phonePayload).unwrap();
        }

        const newAuthDetails = {
          ...authDetail,
          email: data.email ?? investorProfile?.data?.email_address?.email,
          firstName: first_name,
          lastName: last_name,
        };

        await dispatch(setAuthDetail(newAuthDetails));
        setCurrStep(1);
      } catch {
        // do nothing
      }
    },
    [authDetail, dispatch, patchInvestorProfileApi, postEmailApi, investorProfile, postPhoneApi]
  );

  useEffect(() => {
    if (firstRenderRef.current && authDetail.id && authDetail.firstName) {
      navigator.replace("home", "main");
    }
    firstRenderRef.current = false;
  }, [authDetail, navigator]);

  return (
    <>
      {isGettingInvestorData ? (
        <View style={{ flexGrow: 1, justifyContent: "center" }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </View>
      ) : null}

      {isGettingInvestorData && !investorProfile.data ? null : (
        <FlexRow style={{ flexGrow: 1, backgroundColor: themeColor.gray[1] }} alignItems="stretch">
          <Column col={screenType === "sm" ? 24 : 12} style={{ flexGrow: 1 }}>
            <View style={styles.formContainer}>
              <AnimatePresence exitBeforeEnter>
                {currStep === 0 ? (
                  <MotiView
                    key="step1"
                    from={{ opacity: 0, translateX: -50 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    exit={{ opacity: 0, translateX: -50 }}
                    transition={{ type: "timing", duration: 200, delay: 100 }}
                    style={styles.form}
                  >
                    <Typography align="center" type="heading" size="7" weight="bold">
                      Almost Ready
                    </Typography>
                    <Padding height={8} />
                    <Typography color={themeColor.gray[10]} align="center">
                      Please enter your personal details below
                    </Typography>

                    <Padding height={24} />

                    <ControlledInput
                      name="name"
                      placeholder="Enter your name"
                      control={control}
                      label="Full Name"
                      rules={{
                        required: {
                          value: true,
                          message: "Please enter name",
                        },
                        minLength: {
                          value: 2,
                          message: "Please enter a valid name",
                        },
                        pattern: {
                          value: nameRegex,
                          message: "Please enter a valid name",
                        },
                      }}
                    />

                    <Padding height={16} />

                    <ControlledInput
                      name="pan"
                      placeholder="Enter your PAN number"
                      control={control}
                      label="PAN Number"
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

                    {pan.length === 10 ? (
                      <>
                        <Padding height={16} />
                        <DatePicker
                          control={control}
                          placeholder="Select your date of birth"
                          name="date_of_birth"
                          label={isCompany ? "Date of Incorporation" : "Date of Birth"}
                          rules={{
                            required: {
                              value: true,
                              message: isCompany ? "Select date of incorporation" : "Select date of birth",
                            },
                          }}
                        />
                      </>
                    ) : null}

                    {pan.length === 10 && !isCompany ? (
                      <>
                        <Padding height={16} />
                        <ControlledDropDown
                          name="gender"
                          label="Gender"
                          control={control}
                          options={genderOptions}
                          placeholder="Select Gender"
                          rules={{
                            required: {
                              value: true,
                              message: "Please select a gender",
                            },
                          }}
                        />
                      </>
                    ) : null}

                    <Padding height={16} />
                    {investorProfile?.data?.email_address ? (
                      <ControlledInput
                        control={control}
                        name="mobile"
                        label="Mobile"
                        placeholder="Enter mobile number"
                        inputMode="numeric"
                        keyboardType="number-pad"
                        rules={{
                          required: {
                            value: true,
                            message: "Please enter a mobile number",
                          },
                          minLength: {
                            value: 10,
                            message: "Please enter a valid mobile number",
                          },
                          maxLength: {
                            value: 10,
                            message: "Please enter a valid mobile number",
                          },
                          pattern: {
                            value: numberRegex,
                            message: "Please enter a valid mobile number",
                          },
                        }}
                      />
                    ) : (
                      <ControlledInput
                        name="email"
                        placeholder="Enter your email"
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
                    )}

                    <Padding height={16} />
                    <Button
                      title="Next"
                      onPress={handleSubmit(onSubmit)}
                      disabled={isPatchingInvestorProfile || isPostingPhone}
                    />
                  </MotiView>
                ) : null}

                {currStep === 1 ? (
                  <MotiView
                    key="step2"
                    from={{ opacity: 0, translateX: 50 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    exit={{ opacity: 0, translateX: -50 }}
                    transition={{ type: "timing", duration: 200 }}
                    style={styles.form}
                  >
                    <Typography align="center" type="heading" size="7" weight="bold">
                      Congratulations {name}
                    </Typography>
                    <Padding height={24} />

                    <Typography align="center" color={themeColor.gray[11]}>
                      Your account has been created successfully!
                    </Typography>
                    <Padding height={8} />

                    <Typography align="center" color={themeColor.gray[11]}>
                      Click on next to answer a few questions to complete your onboarding process.
                    </Typography>

                    <Padding height={24} />

                    <Button
                      title="Next"
                      onPress={() => navigator.replace("profile", "main")}
                      disabled={isPatchingInvestorProfile || isPostingEmail}
                    />
                  </MotiView>
                ) : null}
              </AnimatePresence>
            </View>
          </Column>
          <Column col={screenType === "sm" ? 0 : 12}>
            <View style={{ backgroundColor: themeColor.accent[4], height: "100%" }}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                source={{ uri: authBackground }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </Column>
        </FlexRow>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  form: {
    width: 320,
  },
});

export default React.memo(Register);
