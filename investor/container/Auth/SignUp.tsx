import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, BackHandler, Image, StyleSheet, View } from "react-native";
import { Asset } from "expo-asset";
import { AnimatePresence, MotiView } from "moti";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { emailRegex, numberRegex, phoneRegex } from "@niveshstar/constant";
import {
  AppDispatch,
  RootStateType,
  ScreenContext,
  setAuthDetail,
  ThemeContext,
  useGetPartnerWhiteLabelInfoQuery,
  usePostSignupMutation,
  usePostSingupOtpMutation,
} from "@niveshstar/context";
import { useNavigation, useTimer } from "@niveshstar/hook";
import { Button, Column, ControlledInput, FlexRow, Padding, Typography } from "@niveshstar/ui";
import { getTimeLeftString } from "@niveshstar/utils";

const authBackground = Asset.fromModule(require("@niveshstar/assets/img/pv-auth-background.png")).uri;

const defaultValues = {
  identifier: "",
  password: "",
  confirm_password: "",
  otp: "",
  otp_id: "",
};

function SignUp() {
  const dispatch = useDispatch<AppDispatch>();
  const { screenType } = useContext(ScreenContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const { authNavigator, navigator, params } = useNavigation();


useEffect(() => {
  const DEFAULT_PARTNER = "paisa-vidya";

  // If user landed on /signup without partner, inject it
  if (!params?.partner) {
    authNavigator.replace("signup", { partner: DEFAULT_PARTNER });
  }
}, [params?.partner, authNavigator]);

  const [signupApi, { isLoading: isSigningUp }] = usePostSignupMutation();
  const [postSingupOtpApi, { isLoading: isPostingSingupOtp }] = usePostSingupOtpMutation();
  const { data: partnerInfo, isLoading: isGetingPartnerInfo } = useGetPartnerWhiteLabelInfoQuery(params?.partner, {
    skip: !params?.partner,
  });

  const [currStep, setCurrStep] = useState(0);
  const { timeLeft, resetTimer } = useTimer(0);
  const { themeColor } = useContext(ThemeContext);

  const { control, handleSubmit, setValue, reset, getValues } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const goBack = useCallback(() => {
    reset({
      ...defaultValues,
      identifier: getValues("identifier"),
    });

    setCurrStep(0);
  }, [reset, getValues]);

  const sendOtp = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          identifier: data.identifier,
          type: data.identifier.includes("@") ? "EMAIL" : "MOBILE",
          partner_id: partnerInfo?.data.partner_id,
        };
        const res = await postSingupOtpApi(payload).unwrap();
        setValue("otp_id", res.data.otp_id);

        resetTimer(60);
        setCurrStep(1);
      } catch {
        //do nothing
      }
    },
    [postSingupOtpApi, resetTimer, partnerInfo, setValue]
  );

  const createUserProfile = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          otp: data.otp,
          role: "INVESTOR",
          otp_id: data.otp_id,
          password: data.password,
          confirm_password: data.confirm_password,
        };

        const res = await signupApi(payload).unwrap();

        const newAuthDetails = {
          id: res.data.id,
          firstName: "",
          lastName: "",
          email: "",
          userType: "investor" as "investor" | "partner",
          uccRegistered: false,
          refreshToken: res.data.refreshToken,
          accessToken: res.data.accessToken,
        };

        await dispatch(setAuthDetail(newAuthDetails));
      } catch {
        //do nothing
      }
    },
    [dispatch, signupApi]
  );

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      switch (currStep) {
        case 0:
          await sendOtp(data);
          break;
        case 1:
          createUserProfile(data);
          break;
      }
    },
    [currStep, sendOtp, createUserProfile]
  );

  useEffect(() => {
    const backAction = () => {
      if (currStep === 1) {
        setCurrStep(0);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [currStep]);

  useEffect(() => {
    if (authDetail.id && !authDetail.firstName) authNavigator.replace("register");
    else if (authDetail.id) navigator.replace("home", "main");
  }, [authDetail, navigator, authNavigator]);

  return (
    <FlexRow style={{ flexGrow: 1, backgroundColor: themeColor.gray[1] }} alignItems="stretch">
      <Column col={screenType === "sm" ? 24 : 12} style={{ flexGrow: 1 }}>
        <View style={styles.formContainer}>
          {isGetingPartnerInfo ? <ActivityIndicator size={70} color={themeColor.accent[9]} /> : null}

          <AnimatePresence exitBeforeEnter>
            {!isGetingPartnerInfo && currStep === 0 ? (
              <MotiView
                key="step1"
                from={{ opacity: 0, translateX: -50 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -50 }}
                transition={{ type: "timing", duration: 200, delay: 100 }}
                style={styles.form}
              >
                {partnerInfo ? (
                  <>
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={{ uri: partnerInfo?.image_logo }}
                        style={styles.logo}
                        resizeMode="stretch"
                        resizeMethod="scale"
                      />
                      <Typography>{partnerInfo?.title}</Typography>
                    </View>
                    <Padding height={16} />
                  </>
                ) : null}

                <Typography align="center" type="heading" size="7" weight="bold">
                  Signup to continue
                </Typography>
                <Padding height={8} />
                <Typography color={themeColor.gray[10]} align="center">
                  Enter your details below to create an account
                </Typography>

                <Padding height={24} />

                <ControlledInput
                  control={control}
                  name="identifier"
                  autoCapitalize="none"
                  label="Mobile or Email"
                  placeholder="Enter mobile or email"
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter a mobile number or email address",
                    },
                    validate: (val) => {
                      const isMobile = phoneRegex.test(val);
                      const isEmail = emailRegex.test(val);

                      if (!isEmail && !isMobile) return "Invalid mobile / email";
                      return true;
                    },
                  }}
                />

                <Padding height={16} />

                <Button
                  title="Next"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isGetingPartnerInfo || isPostingSingupOtp || isSigningUp}
                />

                <Padding height={16} />
                <FlexRow justifyContent="center" alignItems="center">
                  <Typography>Already have an account?</Typography>
                  <Button
                    hitSlop={10}
                    title="Login"
                    variant="link"
                    typographyProps={{ underlined: true, weight: "regular" }}
                    onPress={() => authNavigator.replace("login")}
                  />
                </FlexRow>
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
                  Verify Mobile Number / Email Address
                </Typography>
                <Padding height={8} />
                <Typography color={themeColor.gray[10]} align="center">
                  Please enter otp
                </Typography>

                <Padding height={24} />

                <ControlledInput
                  name="otp"
                  label="OTP"
                  placeholder="Enter your 4 digit OTP"
                  control={control}
                  inputMode="numeric"
                  keyboardType="number-pad"
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter a valid 4 digit number",
                    },
                    pattern: {
                      value: numberRegex,
                      message: "Please enter a valid 4 digit number",
                    },
                    minLength: {
                      value: 4,
                      message: "Please enter a valid 4 digit number",
                    },
                    maxLength: {
                      value: 4,
                      message: "Please enter a valid 4 digit number",
                    },
                  }}
                />

                <FlexRow justifyContent="flex-end">
                  <Button
                    variant="link"
                    title="Edit Mobile / Email?"
                    typographyProps={{ underlined: true, weight: "regular" }}
                    onPress={goBack}
                    style={{ marginTop: -8 }}
                  />
                </FlexRow>

                <Padding height={24} />

                <Typography align="center">Didn't receive OTP?</Typography>

                <Padding height={16} />
                <Typography align="center">{getTimeLeftString(timeLeft)}</Typography>
                <Padding height={16} />

                <FlexRow justifyContent="center">
                  <Button title="Resend OTP" variant="ghost" disabled={timeLeft !== 0} onPress={() => {}} />
                </FlexRow>

                <Padding height={16} />

                <ControlledInput
                  name="password"
                  placeholder="Enter password"
                  control={control}
                  label="Password"
                  secureTextEntry
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter password",
                    },
                  }}
                />

                <Padding height={16} />

                <ControlledInput
                  name="confirm_password"
                  placeholder="Confirm password"
                  control={control}
                  label="Confirm Password"
                  secureTextEntry
                  rules={{
                    required: {
                      value: true,
                      message: "Please re-enter password",
                    },
                    validate: (value: string) => value === getValues("password") || "Passwords do not match",
                  }}
                />

                <Padding height={16} />

                <Button
                  title="Submit"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isGetingPartnerInfo || isPostingSingupOtp || isSigningUp}
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
  logo: {
    width: 100,
    height: 100,
    aspectRatio: 1,
  },
});

export default React.memo(SignUp);
