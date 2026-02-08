import { getPayloadForDocument } from "@niveshstar/utils";

import { companyDetailsType as fieldsType } from "../../common";

type FileType = "pancard_list" | "signatory_list" | "board_resolution" | "address_proof";

export const getPayload = (data: fieldsType, id: string | number, fileType: FileType) => {
  let fileUpload = null;
  const payload = new FormData();
  payload.append("profile_id", id.toString());

  switch (fileType) {
    case "pancard_list":
      fileUpload = getPayloadForDocument(data.pancard_list);
      payload.append("file", fileUpload as any);
      payload.append("purpose", "pan");
      return payload;

    case "signatory_list":
      fileUpload = getPayloadForDocument(data.signatory_list);
      payload.append("file", fileUpload as any);
      payload.append("purpose", "authorised_signatory_list");
      return payload;

    case "board_resolution":
      fileUpload = getPayloadForDocument(data.board_resolution);
      payload.append("file", fileUpload as any);
      payload.append("purpose", "board_resolution");
      return payload;

    case "address_proof":
      fileUpload = getPayloadForDocument(data.address_proof);
      payload.append("file", fileUpload as any);
      payload.append("purpose", "address_proof");
      return payload;

    default:
      return {};
  }
};
