import { Platform } from "react-native";
import * as ImagePickerExpo from "expo-image-picker";
import moment from "moment";

import { colors, darkColors, lightColors, sipDurationOptions } from "@niveshstar/constant";

export function getSipDurationOptions(frequency: string) {
  let factor: number;

  switch (frequency) {
    case "DAILY":
      factor = 365;
      break;
    case "WEEKLY":
      factor = 52;
      break;
    case "FORTNIGHTLY":
      factor = 26;
      break;
    case "MONTHLY":
      factor = 12;
      break;
    case "QUARTERLY":
      factor = 4;
      break;
    case "HALF_YEARLY":
      factor = 2;
      break;
    case "YEARLY":
      factor = 1;
      break;
    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }

  return sipDurationOptions.map((opt) => {
    const installments = Math.round(opt.value * factor);

    if (opt.value === 30) {
      return {
        name: `Until Cancelled | up to 30 years | ${installments} installment${installments === 1 ? "" : "s"}`,
        value: installments,
      };
    }

    return {
      name: `${opt.name} | ${installments} installment${installments === 1 ? "" : "s"}`,
      value: installments,
    };
  });
}

export const getPayloadForImage = async (image: ImagePickerExpo.ImagePickerAsset, purpose: string) => {
  let mimeType = "",
    fileUpload = null;

  if (Platform.OS === "web") {
    mimeType = image.uri.split(",")[0].split(";")[0].split(":")[1];

    const imgFile = await fetch(image.uri);
    fileUpload = await imgFile.blob();
  } else {
    mimeType = `image/${image.uri.split(".").at(-1)}`;
    fileUpload = {
      name: purpose,
      uri: image.uri,
      type: mimeType,
    };
  }

  const payload = new FormData();
  payload.append("file", fileUpload as any);
  payload.append("purpose", purpose);
  // payload.append('name', name);

  return payload;
};

export const getPayloadForBase64 = async (data: any, filename: string, purpose: string) => {
  // const [meta, data] = base64.split(",");

  // const mimeType = meta.split(";")[0].split(":")[1];
  // const extension = mimeType.split("/")[1];

  const extension = data.mimeType.split("/")[1];

  return {
    purpose: purpose,
    base64: data.base64,
    mimetype: data.mimeType,
    filename: `${filename}.${extension}`,
  };
};

export const getPayloadForDocument = (data: any) => {
  const payload =
    Platform.OS === "web"
      ? data.file
      : {
          name: data.name,
          type: data.mimeType,
          size: data.size,
          uri: data.uri,
        };

  return payload;
};

export const getTimeLeftString = (timeLeft: number) => {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;

  let minString = min.toString();
  if (minString.length <= 1) minString = "0" + minString;

  let secString = sec.toString();
  if (secString.length <= 1) secString = "0" + secString;

  return minString + ":" + secString;
};

export const getNextDebitDateString = (debitDate: string) => {
  const currDate = new Date();
  const debDate = parseInt(debitDate);

  let month = "";

  if (debDate >= currDate.getDate()) {
    const temp = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
    month = temp.toLocaleString("default", { month: "long" });
  } else {
    let temp = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
    if (currDate.getDate() > temp.getDate()) {
      temp = new Date(currDate.getFullYear(), temp.getMonth() + 1, 1);
    }
    month = temp.toLocaleString("default", { month: "long" });
  }

  return `Next installment will be auto-debited on ${debDate} ${month}`;
};

export const renderPaymentWebsite = (htmlContent: string) => {
  const newTab = window.open("", "_blank");

  newTab.document.open();
  newTab.document.write(htmlContent);
  newTab.document.close();

  return newTab;
};

export const isOrderValid = (orderStatus: string | undefined) => {
  return orderStatus === undefined || orderStatus === "VALID";
};

export const getMandateStatusDisplay = (status: string, isLight: boolean) => {
  const currColors = isLight ? lightColors : darkColors;

  let bg = currColors.red[9];
  let text = colors.white;
  let label = "Unknown";

  switch (status) {
    case "initiated":
      label = "Initiated";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "active":
      label = "Active";
      bg = currColors.green[9];
      text = colors.white;
      break;
    case "rejected":
      label = "Rejected";
      bg = currColors.red[9];
      text = colors.white;
      break;
    case "cancelled":
      label = "Cancelled";
      bg = currColors.red[9];
      text = colors.white;
      break;
    case "completed":
      label = "Completed";
      bg = currColors.green[9];
      text = colors.white;
      break;
    case "investor_auth_awaited":
      label = "Investor Auth Awaited";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "in_process_agency":
      label = "In Process (Agency)";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "auto_rejected":
      label = "Auto Rejected";
      bg = currColors.red[9];
      text = colors.white;
      break;
    case "pre_debit_notification_sent_successfully":
      label = "Pre-Debit Notification Sent";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "scan_upload_pending":
      label = "Scan Upload Pending";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    default:
      break;
  }

  if (
    status === "INITIATED" ||
    status === "IN_PROCESS_AGENCY" ||
    status === "PRE_DEBIT_NOTIFICATION_SENT_SUCCESSFULLY" ||
    status === "SCAN_UPLOAD_PENDING"
  ) {
    label = "Under Process";
    bg = currColors.yellow[9];
    text = colors.black;
  } else if (status === "INVESTOR_AUTH_AWAITED") {
    label = "Pending Approval";
    bg = currColors.yellow[9];
    text = colors.black;
  } else if (status === "ACTIVE" || status === "COMPLETED") {
    label = "Success";
    bg = currColors.green[9];
    text = colors.white;
  } else if (status === "REJECTED" || status === "CANCELLED" || status === "AUTO_REJECTED") {
    label = "Failed";
    bg = currColors.red[9];
    text = colors.white;
  }

  return { label, bg, text };
};

export const getOrderStatusDisplay = (status: string, isLight: boolean) => {
  const currColors = isLight ? lightColors : darkColors;

  let bg = currColors.red[9];
  let text = colors.white;
  let label = "Unknown";

  switch (status) {
    case "received":
      label = "Received";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "autocancelled":
      label = "autocancelled";
      bg = currColors.red[9];
      text = colors.white;
      break;
    case "order_2fa_pending":
      label = "2FA Pending";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "bank_tpv_pending":
      label = "Bank TPV Pending";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "payment_pending":
      label = "Payment Pending";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "match_pending":
      label = "Matching Pending";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "matched":
      label = "Matched";
      bg = currColors.green[9];
      text = colors.white;
      break;
    case "active":
      label = "Active";
      bg = currColors.green[9];
      text = colors.white;
      break;
    case "sent_to_rta":
      label = "Sent to RTA";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "queued_for_rta":
      label = "Queued for RTA";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "rta_reprocess":
      label = "RTA Reprocess";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "rta_resp_rcvd":
      label = "RTA Response Received";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "rta_rejected":
      label = "RTA Rejected";
      bg = currColors.red[9];
      text = colors.white;
      break;
    case "units_rta_settled":
      label = "Units Settled";
      bg = currColors.green[9];
      text = colors.white;
      break;
    case "matured":
      label = "Matured";
      bg = currColors.green[9];
      text = colors.white;
      break;
    case "done":
      label = "Completed";
      bg = currColors.green[9];
      text = colors.white;
      break;
    case "platform_rejected":
      label = "Platform Rejected";
      bg = currColors.red[9];
      text = colors.white;
      break;
    case "threshold_approval_pending":
      label = "Threshold Approval Pending";
      bg = currColors.yellow[9];
      text = colors.black;
      break;
    case "ops_rejected":
      label = "Operations Rejected";
      bg = currColors.red[9];
      text = colors.white;
      break;
    case "expired":
      label = "Expired";
      bg = currColors.red[9];
      text = colors.white;
      break;
    case "ucc_rejected":
      label = "UCC Rejected";
      bg = currColors.red[9];
      text = colors.white;
      break;
    default:
      break;
  }

  if (
    status === "RECEIVED" ||
    status === "ORDER_2FA_PENDING" ||
    status === "BANK_TPV_PENDING" ||
    status === "PAYMENT_PENDING" ||
    status === "MATCH_PENDING" ||
    status === "QUEUED_FOR_RTA" ||
    status === "THRESHOLD_APPROVAL_PENDING" ||
    status === "SENT_TO_RTA" ||
    status === "RTA_REPROCESS" ||
    status === "RTA_RESP_RCVD" ||
    status === "SXP_2FA_PENDING" ||
    status === "PAUSED" ||
    status === "MATCHED" ||
    status === "REG"
  ) {
    label = "Under Process";
    bg = currColors.yellow[9];
    text = colors.black;
  } else if (
    status === "ACTIVE" ||
    status === "DONE" ||
    status === "UNITS_RTA_SETTLED" ||
    status === "MATURED" ||
    status === "SXP_ORD_TRIGGERED"
  ) {
    label = "Success";
    bg = currColors.green[9];
    text = colors.white;
  } else if (
    status === "RTA_REJECTED" ||
    status === "PLATFORM_REJECTED" ||
    status === "OPS_REJECTED" ||
    status === "UCC_REJECTED" ||
    status === "SXP_INVESTOR_CANC" ||
    status === "CANCELLED" ||
    status === "MANDATE_UNLINK" ||
    status === "AUTOCANCELLED" ||
    status === "EXPIRED" ||
    status === "DONE" ||
    status === "UNITS_RTA_SETTLED" ||
    status === "MATURED" ||
    status === "SXP_ORD_TRIGGERED"
  ) {
    label = "Failed";
    bg = currColors.red[9];
    text = colors.white;
  }

  return { label, bg, text };
};

export const formatBseDateTime = (isoStr: string) => {
  if (!isoStr) return "-";
  const cleaned = isoStr.replace(/ [A-Z]{3}$/, "");
  const parsed = moment(cleaned, "YYYY-MM-DD HH:mm:ss.SSSSSS Z", true);
  const date = parsed.isValid() ? parsed : moment(isoStr);
  return date.format("DD/MM/YYYY hh:mm A");
};

type FontWeight = "light" | "regular" | "medium" | "bold";

export const getFontFamily = (weight: FontWeight) => {
  switch (weight) {
    case "light":
      return "Inter-Light";
    case "regular":
      return "Inter-Regular";
    case "medium":
      return "Inter-Medium";
    case "bold":
      return "Inter-Bold";
    default:
      return "Inter-Regular";
  }
};

export const getAvatarInitials = (name: string) => {
  if (!name) return "AZ";
  const split = name.split(" ");
  const firstName = split[0].length > 1 ? split[0][0] : "";
  const lastName = split.length > 1 && split[1].length > 0 ? split[1][0] : "";
  const result = `${firstName.toUpperCase()}${lastName.toUpperCase()}`;
  return result.length ? result : "AZ";
};

export const getNamesPart = (name: string) => {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  let first_name = null;
  let middle_name = null;
  let last_name = null;

  if (nameParts.length === 1) {
    first_name = nameParts[0];
  } else if (nameParts.length === 2) {
    [first_name, last_name] = nameParts;
  } else if (nameParts.length >= 3) {
    first_name = nameParts[0];
    middle_name = nameParts[1];
    last_name = nameParts.slice(2).join(" ");
  }

  return { first_name, middle_name, last_name };
};
