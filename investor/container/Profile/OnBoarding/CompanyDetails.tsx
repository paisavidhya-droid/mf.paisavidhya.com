import React, { useCallback, useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext, usePatchInvestorProfileMutation, usePostFileMutation } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { Button, FlexRow, Padding, Typography } from "@niveshstar/ui";

import CompanyQuestions from "../../../components/Profile/OnBoard/CompanyDetails/CompanyQuestions";
import { getPayload } from "../../../components/Profile/OnBoard/CompanyDetails/Payload";
import Progress from "../../../components/Profile/OnBoard/ProgressBar";

const defaultValues = {
  pancard_list: "",
  signatory_list: "",
  board_resolution: "",
  address_proof: "",
};

function CompanyDetails() {
  const { navigator } = useNavigation();
  const { themeColor } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [postFileApi, { isLoading: isPostingFile }] = usePostFileMutation();
  const [patchInvestorProfileApi, { isLoading: isPatchingInvestorProfile }] = usePatchInvestorProfileMutation();

  const { control, handleSubmit } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const payload = {
          pancard_list: getPayload(data, authDetail.id, "pancard_list"),
          signatory_list: getPayload(data, authDetail.id, "signatory_list"),
          board_resolution: getPayload(data, authDetail.id, "board_resolution"),
          address_proof: getPayload(data, authDetail.id, "address_proof"),
        };

        const pancardRes = await postFileApi(payload.pancard_list).unwrap();
        const signatoryRes = await postFileApi(payload.signatory_list).unwrap();
        const boardRes = await postFileApi(payload.board_resolution).unwrap();
        const addressProofRes = await postFileApi(payload.address_proof).unwrap();

        const patchPayload = {
          id: authDetail.id,
          pancard_list: pancardRes.id,
          signatory_list: signatoryRes.id,
          board_resolution: boardRes.id,
          address_proof: addressProofRes.id,
        };

        await patchInvestorProfileApi(patchPayload);
        navigator.navigate("profile", "main");
      } catch {
        //pass
      }
    },
    [patchInvestorProfileApi, postFileApi, navigator, authDetail.id]
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <View style={styles.wrapper}>
        <Progress percent={80} />
        <Padding height={24} />

        <Typography size="3" weight="medium">
          Company Details
        </Typography>
        <Padding height={24} />

        <CompanyQuestions control={control} />
        <Padding height={24} />

        <FlexRow justifyContent="center" colGap={16}>
          <Button disabled icon={<Entypo name="chevron-left" size={30} color={themeColor.accent[6]} />} />
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isPostingFile || isPatchingInvestorProfile}
            icon={
              <Entypo
                name="chevron-right"
                size={30}
                color={isPostingFile || isPatchingInvestorProfile ? themeColor.accent[6] : themeColor.gray[1]}
              />
            }
          />
        </FlexRow>
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

export default React.memo(CompanyDetails);
