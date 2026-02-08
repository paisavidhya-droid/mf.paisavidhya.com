import React, { useCallback, useMemo, useState } from "react";
import { Alert, Linking } from "react-native";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { RootStateType, useGetInvestorProfileQuery, usePostFileMutation } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { getPayloadForDocument, toastHelper } from "@niveshstar/utils";

import Button from "../../Button";
import ControlledInput from "../../ControlledInput";
import CustomModal from "../../CustomModal";
import Divider from "../../Divider";
import DocumentPicker from "../../DocumentPicker";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

const defaultValues = {
  pdfFile: null,
  password: "",
};

function ManualImport() {
  const { params } = useNavigation();
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [isManualModalVisible, setManualModalVisible] = useState(false);

  const authDetail = useSelector((state: RootStateType) => state.auth);

  const investorId = useMemo(() => {
    if (authDetail.userType === "investor") return authDetail.id;
    else return params?.investorId;
  }, [authDetail, params]);

  const { data: investorProfile = null, isFetching: isFetchingInvestorProfile } = useGetInvestorProfileQuery(
    investorId,
    {
      skip: !investorId,
    }
  );

  const [postFileApi, { isLoading: isPostingFile }] = usePostFileMutation();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const openUploadModal = useCallback(() => {
    setUploadModalVisible(true);
  }, []);
  const closeUploadModal = useCallback(() => {
    setUploadModalVisible(false);
    reset();
  }, [reset]);

  const openManualModal = useCallback(() => {
    setManualModalVisible(true);
  }, []);
  const closeManualModal = useCallback(() => {
    setManualModalVisible(false);
  }, []);

  const openUrl = useCallback(
    (url: string) => async () => {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(`Can't open this URL: ${url}`);
        return;
      }
      await Linking.openURL(url);
    },
    []
  );

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        const payload = new FormData();

        const fileUpload = getPayloadForDocument(data.pdfFile);
        payload.append("file", fileUpload as any);
        payload.append("password", data.password);
        payload.append("purpose", "cas_import");
        payload.append("pan_number", investorProfile.investor_profile.pan);

        await postFileApi(payload).unwrap();
        toastHelper("success", "File uploaded successfully!");

        closeUploadModal();
      } catch {
        //pass
      }
    },
    [investorProfile, postFileApi, closeUploadModal]
  );

  return (
    <>
      <Typography size="5" weight="medium">
        Portfolio Tracker
      </Typography>
      <Padding height={24} />

      <Typography size="3" weight="medium">
        Import via consolidated statement
      </Typography>
      <Padding height={16} />
      <Typography>Step 1: Obtain consolidated account statement</Typography>
      <Padding height={8} />
      <Typography>
        Consolidated Account Statement (CAS) is a feature offered by CAMS and Kfintech. It allows investors to generate
        a single account statement containing all transactions across all mutual funds.
      </Typography>
      <Padding height={16} />
      <FlexRow>
        <Button variant="soft" title="Generate PDF statement" onPress={openManualModal} />
      </FlexRow>

      <Padding height={32} />
      <Divider />
      <Padding height={32} />

      <Typography>Step 2: Upload consolidated account statement</Typography>
      <Padding height={8} />
      <Typography>
        Upload the detailed CAS below to import the holdings onto the platform for tracking and transacting.
      </Typography>
      <Padding height={16} />
      <FlexRow>
        <Button variant="soft" title="Upload File" onPress={openUploadModal} />
      </FlexRow>

      <CustomModal
        maxWidth={500}
        minWidth={500}
        title="Upload CAMS"
        footerTitle="Submit"
        closeModal={closeUploadModal}
        isModalVisible={isUploadModalVisible}
        onConfirm={handleSubmit(onSubmit)}
        primaryBtnProps={{
          disabled: isPostingFile || isFetchingInvestorProfile,
          loading: isPostingFile,
        }}
      >
        <Typography>Upload Latest CAMS/KARVY Consolidated Account Statement</Typography>
        <Padding height={16} />
        <DocumentPicker
          control={control}
          name="pdfFile"
          label="Upload File"
          title="Select File"
          rules={{
            required: {
              value: true,
              message: "Please select PDF",
            },
          }}
        />
        <Padding height={16} />
        <ControlledInput
          control={control}
          name="password"
          label="File Password"
          placeholder="Enter file password"
          rules={{
            required: {
              value: true,
              message: "Please enter file password",
            },
          }}
        />
      </CustomModal>

      <CustomModal
        footerTitle="OK"
        title="Generate CAS"
        onConfirm={closeManualModal}
        closeModal={closeManualModal}
        isModalVisible={isManualModalVisible}
      >
        <Typography>Please visit this link to generate the statement</Typography>
        <Padding height={8} />
        <Button
          variant="link"
          style={{ paddingHorizontal: 0 }}
          typographyProps={{ align: "left" }}
          title="https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement"
          onPress={openUrl("https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement")}
          flexRowProps={{
            style: {
              justifyContent: "flex-start",
              flexWrap: "wrap",
              flex: 1,
            },
          }}
        />
        <Padding height={8} />
        <Typography>Enter the following details: </Typography>
        <Padding height={8} />
        <Typography>
          1. Statement Type: <Typography>Detailed</Typography>
        </Typography>
        <Padding height={8} />

        <Typography>
          2. Period:&nbsp;
          <Typography weight="medium">Specific Period from 01-Jan-1987 till Today </Typography>
        </Typography>
        <Padding height={8} />

        <Typography>
          3. Folio Listing:&nbsp;
          <Typography weight="medium">With Zero balance folios</Typography>
        </Typography>
        <Padding height={8} />

        <Typography>
          4. Email: <Typography weight="medium">somemail@gmail.com</Typography>
        </Typography>
        <Padding height={8} />

        <Typography>
          5. PAN: <Typography weight="medium">BHGFT1234R</Typography>
        </Typography>
        <Padding height={8} />

        <Typography>
          6. Password: <Typography weight="medium">98765@!#asds</Typography>
        </Typography>
        <Padding height={24} />

        <Typography size="3" weight="medium">
          Please Note:
        </Typography>
        <Padding height={8} />

        <Typography>
          After you submit, the client will receive the statement via email from CAMS within 15 minutes (may sometime
          take upto 24 hours).
        </Typography>
        <Padding height={8} />

        <Typography>
          After you obtain the statement, go to "Holdings" &#8594; "External" &#8594; "Upload CAS".
        </Typography>
      </CustomModal>
    </>
  );
}

export default React.memo(ManualImport);
