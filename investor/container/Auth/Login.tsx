import React, { useCallback, useContext, useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Asset } from "expo-asset";
import { MotiView } from "moti";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { numberRegex } from "@niveshstar/constant";
import {
  AppDispatch,
  RootStateType,
  ScreenContext,
  setAuthDetail,
  ThemeContext,
  usePostLoginMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, Column, ControlledInput, FlexRow, Padding, Typography } from "@niveshstar/ui";

const authBackground = Asset.fromModule(require("@niveshstar/assets/img/auth-background.webp")).uri;

const defaultValue = {
  mobile: "",
  password: "",
};

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);
  const { navigator, authNavigator } = useNavigation();
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [loginApi, { isLoading }] = usePostLoginMutation();

  const { control, handleSubmit } = useForm({
    defaultValues: defaultValue,
    reValidateMode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (data: typeof defaultValue) => {
      try {
        const payload = {
          role: "INVESTOR",
          mobile: data.mobile,
          password: data.password,
        };

        const res = await loginApi(payload).unwrap();

        const newAuthDetails = {
          id: res.data.id,
          email: res.data.email,
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          uccRegistered: false,
          userType: "investor" as "investor" | "partner",
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        };

        await dispatch(setAuthDetail(newAuthDetails));

        if (!res.data.first_name) authNavigator.replace("register");
        else navigator.replace("home", "main");
      } catch {
        // do nothing
      }
    },
    [dispatch, loginApi, authNavigator, navigator]
  );

  useEffect(() => {
    if (authDetail.id && !authDetail.firstName) authNavigator.replace("register");
    else if (authDetail.id) navigator.replace("home", "main");
  }, [authDetail, navigator, authNavigator]);

  return (
    <FlexRow style={{ flexGrow: 1, backgroundColor: themeColor.gray[1] }} alignItems="stretch">
      <Column col={screenType === "sm" ? 24 : 12} style={{ flexGrow: 1 }}>
        <View style={styles.formContainer}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 200, delay: 100 }}
            style={styles.form}
          >
            <Typography align="center" type="heading" size="7" weight="bold">
              Login to your account
            </Typography>
            <Padding height={8} />
            <Typography color={themeColor.gray[10]} align="center">
              Enter your mobile below to login to your account
            </Typography>

            <Padding height={24} />

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

            <Padding height={16} />

            <ControlledInput
              name="password"
              autoCapitalize="none"
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

            <FlexRow justifyContent="flex-end" style={{ marginTop: -8 }}>
              <Button
                variant="link"
                disabled={isLoading}
                style={{ marginTop: 0 }}
                title="Forgot your password?"
                typographyProps={{ underlined: true, weight: "regular" }}
                onPress={() => authNavigator.replace("reset-password")}
              />
            </FlexRow>

            <Padding height={16} />

            <Button title="Submit" loading={isLoading} disabled={isLoading} onPress={handleSubmit(onSubmit)} />
            <Padding height={16} />
            <FlexRow justifyContent="center" alignItems="center">
              <Typography>Don't have an account?</Typography>

              <Button
                hitSlop={10}
                title="Signup"
                variant="link"
                typographyProps={{ underlined: true, weight: "regular" }}
                onPress={() => authNavigator.replace("signup")}
              />
            </FlexRow>
          </MotiView>
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
    maxWidth: 320,
  },
});

export default React.memo(Login);
