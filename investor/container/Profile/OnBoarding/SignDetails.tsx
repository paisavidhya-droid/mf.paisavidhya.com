import React, { useCallback, useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  AppDispatch,
  RootStateType,
  setAuthDetail,
  ThemeContext,
  usePostCreatePhysicalUccMutation,
  usePatchInvestorProfileMutation,
  usePostFileBase64Mutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, CustomCard, DigitalSign, Padding, Typography } from "@niveshstar/ui";
import { getPayloadForBase64 } from "@niveshstar/utils";

import Progress from "../../../components/Profile/OnBoard/ProgressBar";

function SignDetails() {
  const { navigator } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [postFileBase64Api, { isLoading: isPostingBase64File }] = usePostFileBase64Mutation();
  const [patchInvestorProfileApi, { isLoading: isPatchingInvestorProfile }] = usePatchInvestorProfileMutation();
  const [postCreatePhysicalUccApi, { isLoading: isGettingCreatePhysicalUcc, error, isError }] =
    usePostCreatePhysicalUccMutation();

  const handleSubmit = useCallback(
    async (sign: string) => {
      try {
        //
        const signData = {
          base64: sign.split(",")[1],
          mimeType: "image/png",
        };

        const imgPayload = await getPayloadForBase64(signData, "signature", "INVESTOR_SIGN");

        const imgRes = await postFileBase64Api({ investorId: undefined, payload: imgPayload }).unwrap();

        const payload = { signature_id: imgRes.data.id };
        await patchInvestorProfileApi({ investorId: undefined, payload: payload }).unwrap();

        const uccResponse = await postCreatePhysicalUccApi(undefined).unwrap();

        if (!uccResponse.success) return;

        await dispatch(
          setAuthDetail({
            ...authDetail,
            uccRegistered: true,
          })
        );

        navigator.replace("profile", "main");
      } catch {
        //pass
      }
    },
    [postFileBase64Api, patchInvestorProfileApi, navigator, authDetail, dispatch, postCreatePhysicalUccApi]
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <View style={styles.wrapper}>
        <Progress percent={95} />
        <Padding height={24} />
        <Typography size="3" weight="medium">
          Digital Sign
        </Typography>
        <Padding height={24} />

        {isError ? (
          <>
            <CustomCard style={{ backgroundColor: themeColor.red[3], borderColor: themeColor.red[8] }}>
              <Typography size="2" weight="medium" color={themeColor.red[11]}>
                {"status" in error &&
                error.data &&
                typeof error.data === "object" &&
                "message" in error.data &&
                typeof error.data.message === "string"
                  ? error.data.message
                  : "Something went wrong!"}
                Something went wrong!
              </Typography>
            </CustomCard>

            <Padding height={16} />

            <Typography align="center" size="2" color={themeColor.gray[11]}>
              Don't worry, this usually happens when some profile details are missing or incorrect.
            </Typography>

            <Padding height={16} />

            <Typography align="center" size="2" color={themeColor.gray[10]}>
              Please review your profile details and make sure everything is correct.
            </Typography>

            <Padding height={16} />

            <Typography align="center" size="1" color={themeColor.gray[9]}>
              When you're ready to retry, go to Profile, select BSE Details and tap Retry
            </Typography>

            <Padding height={24} />

            <Button title="Review Profile" onPress={() => navigator.replace("profile", "main")} />
          </>
        ) : (
          <View style={{ flexGrow: 1 }}>
            <DigitalSign
              onSubmit={handleSubmit}
              secondaryBtnProps={{
                disabled: isPostingBase64File || isGettingCreatePhysicalUcc || isPatchingInvestorProfile,
              }}
              primaryBtnProps={{
                disabled: isPostingBase64File || isGettingCreatePhysicalUcc || isPatchingInvestorProfile,
                loading: isPostingBase64File || isGettingCreatePhysicalUcc || isPatchingInvestorProfile,
              }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  wrapper: {
    flexGrow: 1,
    padding: 12,
    maxWidth: 400,
    width: "100%",
    margin: "auto",
  },
});

export default React.memo(SignDetails);