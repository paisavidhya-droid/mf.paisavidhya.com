import React, { useCallback, useContext, useState } from "react";
import { Image, Linking, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { colors } from "@niveshstar/constant";
import {
  RootStateType,
  ThemeContext,
  useGetCreatePhysicalUccMutation,
  useGetUploadAofMutation,
  useLazyGetInvestorBseDetailsQuery,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import Button from "../../Button";
import CustomModal from "../../CustomModal";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import UccStatusModal from "./UccStatusModal";

interface PropsType {
  investorProfile: any;
}

function BseDetails(props: PropsType) {
  const { investorProfile } = props;
  const profile = investorProfile;

  const { params } = useNavigation();
  const authDetail = useSelector((state: RootStateType) => state.auth);
  const textSize = authDetail.userType === "partner" ? "1" : "2";

  const { themeColor } = useContext(ThemeContext);
  const [isUccModalVisible, setIsUccModalVisible] = useState(false);

  const closeUccModal = useCallback(() => {
    setIsUccModalVisible(false);
  }, []);

  const openUccModal = useCallback(() => {
    setIsUccModalVisible(true);
  }, []);

  const [getUploadAofApi, { isLoading: isGettingUploadAof }] = useGetUploadAofMutation();
  const [getUccStatusApi, { isLoading: isGettingUccData, data: uccData, error: uccError }] =
    useLazyGetInvestorBseDetailsQuery();
  const [getCreatePhysicalUccApi, { isLoading: isGettingCreatePhysicalUcc }] = useGetCreatePhysicalUccMutation();

  const retryInvestmentAcc = useCallback(async () => {
    try {
      await getCreatePhysicalUccApi(params?.investorId ?? undefined).unwrap();
    } catch {
      //pass
    }
  }, [getCreatePhysicalUccApi, params]);

  const retryAofUpload = useCallback(async () => {
    try {
      await getUploadAofApi(params?.investorId ?? undefined).unwrap();
    } catch {
      //pass
    }
  }, [getUploadAofApi, params]);

  const checkUccStatus = useCallback(async () => {
    try {
      await getUccStatusApi(params?.investorId ?? undefined).unwrap();
    } catch {
      //pass
    }
    openUccModal();
  }, [getUccStatusApi, openUccModal, params]);

  return (
    <>
      <Typography align="left" size="5" weight="medium">
        BSE Details
      </Typography>
      <Padding height={24} />

      <FlexRow>
        <Typography color={themeColor.gray[11]} weight="medium" size={textSize}>
          PAN:&nbsp;
        </Typography>
        <Typography size={textSize}>{profile?.pan ?? "-"}</Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography color={themeColor.gray[11]} weight="medium" size={textSize}>
          Client Code (UCC):&nbsp;
        </Typography>
        <Typography size={textSize}>{profile?.client_code ?? "-"}</Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography color={themeColor.gray[11]} weight="medium" size={textSize}>
          Aof:&nbsp;
        </Typography>
        {profile.aof ? (
          <Button
            title="Open"
            variant="link"
            style={{ paddingVertical: 0 }}
            onPress={() => Linking.openURL(profile.aof)}
          />
        ) : profile.client_code ? (
          <Button
            title="Retry"
            variant="link"
            style={{ paddingVertical: 0 }}
            onPress={retryAofUpload}
            disabled={isGettingUploadAof}
            loading={isGettingUploadAof}
          />
        ) : null}
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography color={themeColor.gray[11]} weight="medium" size={textSize}>
          UCC Status:&nbsp;
        </Typography>
        <Typography size={textSize}>{profile?.client_code ? "Active" : "-"}</Typography>
        {!profile?.client_code ? (
          <Button
            title="Retry"
            variant="link"
            style={{ paddingVertical: 0 }}
            onPress={retryInvestmentAcc}
            disabled={isGettingCreatePhysicalUcc}
            loading={isGettingCreatePhysicalUcc}
          />
        ) : null}
      </FlexRow>
      <Padding height={8} />

      {profile?.signature && (
        <>
          <FlexRow>
            <Typography color={themeColor.gray[11]} weight="medium" size={textSize}>
              Signature:&nbsp;
            </Typography>
            <Image source={{ uri: profile.signature }} style={styles.img} resizeMode="stretch" resizeMethod="resize" />
          </FlexRow>
          <Padding height={8} />
        </>
      )}

      {profile.client_code ? (
        <>
          <Padding height={24} />
          <FlexRow>
            <Button
              variant="soft"
              title="Check UCC Status"
              onPress={checkUccStatus}
              loading={isGettingUccData}
              disabled={isGettingUccData}
            />
          </FlexRow>
        </>
      ) : null}

      <CustomModal
        heightPercent={70}
        title="UCC Status Details"
        closeModal={closeUccModal}
        isModalVisible={isUccModalVisible}
      >
        <UccStatusModal data={uccData} error={uccError} />
      </CustomModal>
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    backgroundColor: colors.white,
    borderRadius: 5,
    width: 200,
    height: 100,
  },
});

export default React.memo(BseDetails);
