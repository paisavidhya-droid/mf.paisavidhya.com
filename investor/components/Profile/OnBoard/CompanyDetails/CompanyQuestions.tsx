import React from "react";
import { Control } from "react-hook-form";

import { DocumentPicker, Padding } from "@niveshstar/ui";

interface PropsType {
  control: Control<any>;
}

export default function CompanyQuestions(props: PropsType) {
  const { control } = props;

  return (
    <>
      <DocumentPicker
        control={control}
        name="pancard_list"
        label="Upload Pancard"
        title="Select Pancard"
        rules={{
          required: {
            value: true,
            message: "Please upload pancard",
          },
        }}
      />

      <Padding height={16} />
      <DocumentPicker
        control={control}
        name="signatory_list"
        label="Upload Singatory List"
        title="Select Singatory List"
        rules={{
          required: {
            value: true,
            message: "Please upload Singatory List",
          },
        }}
      />

      <Padding height={16} />
      <DocumentPicker
        control={control}
        name="board_resolution"
        label="Upload Board Resolution"
        title="Select Board Resolution"
        rules={{
          required: {
            value: true,
            message: "Please upload Board Resolution",
          },
        }}
      />

      <Padding height={16} />
      <DocumentPicker
        control={control}
        name="address_proof"
        label="Upload Address Proof"
        title="Select Address Proof"
        rules={{
          required: {
            value: true,
            message: "Please upload Address Proof",
          },
        }}
      />
    </>
  );
}
