import React, { useCallback, useContext, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Asset } from "expo-asset";
import { AnimatePresence, MotiView } from "moti";
import { useForm } from "react-hook-form";

import { emailRegex, numberRegex, phoneRegex } from "@niveshstar/constant";
import {
  ScreenContext,
  ThemeContext,
  usePostResetPassowrdOtpMutation,
  usePostResetPasswordMutation,
} from "@niveshstar/context";
import { useNavigation, useTimer } from "@niveshstar/hook";
import { Button, Column, ControlledInput, FlexRow, Padding, Typography } from "@niveshstar/ui";
import { getTimeLeftString } from "@niveshstar/utils";

const authBackground = Asset.fromModule(require("@niveshstar/assets/img/auth-background.webp")).uri;

const defaultValues = {
  otp: "",
  otp_id: "",
  identifier: "",
  password: "",
  confirm_password: "",
};

function ResetPassword() {
  const { authNavigator } = useNavigation();

  const [currStep, setCurrStep] = useState(0);
  const { timeLeft, resetTimer } = useTimer(0);
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);

  const [postResetPasswordApi, { isLoading: isPostingResetPassword }] = usePostResetPasswordMutation();
  const [postSendResetOtpApi, { isLoading: isPostingSendResetOtp }] = usePostResetPassowrdOtpMutation();

  const { control, handleSubmit, setValue, reset, getValues } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const goBack = useCallback(() => {
    reset(
      {
        otp: "",
        otp_id: "",
        password: "",
        confirm_password: "",
      },
      { keepValues: true }
    );

    setCurrStep(0);
  }, [reset]);

  const sendOtp = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          identifier: data.identifier,
          type: data.identifier.includes("@") ? "EMAIL" : "MOBILE",
        };

        const res = await postSendResetOtpApi(payload).unwrap();
        setValue("otp_id", res.data.otp_id);

        resetTimer(60);
        setCurrStep(1);
      } catch {
        // do nothing
      }
    },
    [postSendResetOtpApi, resetTimer, setValue]
  );

  const resetPassword = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          otp: data.otp,
          otp_id: data.otp_id,
          password: data.password,
        };

        await postResetPasswordApi(payload).unwrap();
        setCurrStep(2);
      } catch {
        //do nothing
      }
    },
    [postResetPasswordApi]
  );

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      switch (currStep) {
        case 0:
          await sendOtp(data);
          break;
        case 1:
          resetPassword(data);
          break;
      }
    },
    [sendOtp, resetPassword, currStep]
  );

  return (
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
                  Reset Password
                </Typography>
                <Padding height={8} />
                <Typography color={themeColor.gray[10]} align="center">
                  Enter your mobile below to reset passsword
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
                  disabled={isPostingSendResetOtp || isPostingResetPassword}
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
                  Almost Ready
                </Typography>
                <Padding height={8} />
                <Typography color={themeColor.gray[10]} align="center">
                  Please enter OTP and new password
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
                      value: false,
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
                    title="Edit Mobile?"
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
                      value: false,
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
                      value: false,
                      message: "Please re-enter password",
                    },
                    validate: (value: string) => value === getValues("password") || "Passwords do not match",
                  }}
                />

                <Padding height={16} />

                <Button
                  title="Submit"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isPostingSendResetOtp || isPostingResetPassword}
                />
              </MotiView>
            ) : null}

            {currStep === 2 ? (
              <MotiView
                key="step3"
                from={{ opacity: 0, translateX: 50 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: 50 }}
                transition={{ type: "timing", duration: 200 }}
                style={styles.form}
              >
                <Typography align="center" type="heading" size="7" weight="bold">
                  Your password was reset
                </Typography>
                <Padding height={16} />
                <Typography color={themeColor.gray[10]} align="center">
                  Please use your new password to login
                </Typography>

                <Padding height={24} />

                <Button
                  title="Login"
                  onPress={() => authNavigator.replace("login")}
                  disabled={isPostingSendResetOtp || isPostingResetPassword}
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
});

export default React.memo(ResetPassword);
