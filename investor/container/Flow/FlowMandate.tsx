import React, { useCallback, useContext, useMemo } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import {
  RootStateType,
  ThemeContext,
  useGetMandateByIdWithTokenQuery,
  usePostEnqueuMandateWithTokenMutation,
} from "@niveshstar/context";
import { useNavigation, useTimer } from "@niveshstar/hook";
import { Button, FlexRow, Padding } from "@niveshstar/ui";

import FlowMandateForm from "../../components/FlowMandate/FlowMandateForm";
import FlowMandateTimer from "../../components/FlowMandate/FlowMandateTimer";

function FlowMandate() {
  const { params } = useNavigation();
  const { timeLeft, resetTimer } = useTimer(0);
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const accessToken = useMemo(() => {
    return params.key ?? authDetail.accessToken;
  }, [params, authDetail.accessToken]);

  const [postEnqueuMandateApi, { isLoading: isPostingEnqueueMandate }] = usePostEnqueuMandateWithTokenMutation();

  const { data: mandateData, isLoading: isGettingMandateData } = useGetMandateByIdWithTokenQuery(
    { mandateId: params.id, accessToken },
    { skip: !params.id || !accessToken }
  );

  const getBseApprovalLink = useCallback(async () => {
    try {
      const res = await postEnqueuMandateApi({ mandateId: params.id, accessToken }).unwrap();
      const url = res.enach_auth_url;
      if (url) return { success: true, url };
      return { success: false, url: "" };
    } catch {
      return { success: false, url: "" };
    }
  }, [postEnqueuMandateApi, params, accessToken]);

  const pollBseApprovalLink = useCallback(async () => {
    let retryCount = 0;
    const maxRetry = 30;
    const checkInterval = 10 * 1000;
    let intervalId: NodeJS.Timeout | null = null;

    resetTimer(300);

    async function checkBseApprovalLink() {
      retryCount++;

      const res = await getBseApprovalLink();

      if (res.success && res.url) {
        clearInterval(intervalId!);
        window.location.assign(res.url);
      }

      if (retryCount >= maxRetry) {
        clearInterval(intervalId!);
        resetTimer(0);
      }
    }

    checkBseApprovalLink();
    intervalId = setInterval(checkBseApprovalLink, checkInterval);
  }, [getBseApprovalLink, resetTimer]);

  return (
    <ScrollView contentContainerStyle={[style.container, { backgroundColor: themeColor.gray[1] }]}>
      <View style={style.wrapper}>
        {isGettingMandateData ? (
          <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </FlexRow>
        ) : null}

        {!isGettingMandateData && mandateData && mandateData.image_logo ? (
          <>
            <FlexRow justifyContent="center">
              <Image
                source={{ uri: mandateData.image_logo }}
                style={style.logo}
                resizeMode="stretch"
                resizeMethod="scale"
              />
            </FlexRow>
            <Padding height={16} />
          </>
        ) : null}
        {!isGettingMandateData && mandateData && timeLeft === 0 ? (
          <>
            <FlowMandateForm data={mandateData} />
            <Padding height={16} />
            <Button
              title="Continue"
              onPress={pollBseApprovalLink}
              disabled={isPostingEnqueueMandate}
              loading={isPostingEnqueueMandate}
            />
          </>
        ) : null}

        {!isGettingMandateData && timeLeft !== 0 ? <FlowMandateTimer timeLeft={timeLeft} /> : null}
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
  },
  wrapper: {
    flexGrow: 1,
    padding: 12,
    maxWidth: 600,
    marginHorizontal: "auto",
  },
  btn: {
    width: "100%",
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default React.memo(FlowMandate);
