import { getPayloadForBase64 } from "@niveshstar/utils";

export const getInvestorPayload = async (data: any, type: "PERSONAL_DETAILS" | "ADDRESS" | "NOMINEE" | "BANK") => {
  let identifier_number = "";
  const payload = {
    personal_details: {},
    address: {},
    nominee: {},
    bank: {} as any,
    identifier: {} as any,
    cancelled_cheque: null,
  };

  switch (type) {
    case "PERSONAL_DETAILS": //personal details
      payload.personal_details = {
        first_name: data.first_name,
        middle_name: data.middle_name || null,
        last_name: data.last_name,
        occupation: data.occupation.value,
        gender: data.gender.value,
        date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString() : undefined,
        pan: data.pan,
        country_of_birth: data.country_of_birth.value,
        source_of_wealth: data.source_of_wealth.value,
        income_slab: data.income_slab.value,
        pep_details: data.pep_details.value,
        place_of_birth: data.place_of_birth,
      };

      return payload;

    case "ADDRESS":
      payload.address = {
        line1: data.address.line1,
        line2: data.address.line2 || null,
        line3: data.address.line3 || null,
        state: data.address.state.value,
        country: data.address.country.value,
        type: data.address.type.value,
        city: data.address.city,
        postal_code: data.address.postal_code,
      };

      return payload;

    case "NOMINEE": //nominee
      payload.nominee = {
        first_name: data.nominee.first_name,
        middle_name: data.nominee.middle_name || null,
        last_name: data.nominee.last_name || null,
        date_of_birth: data.nominee.date_of_birth ? new Date(data.nominee.date_of_birth).toISOString() : undefined,
        relationship: data.nominee.relationship.value,
        nomination_percent: parseFloat(data.nominee.nomination_percent),
        email: data.nominee.email,
        mobile: data.nominee.mobile,
        line1: data.nominee.line1,
        line2: data.nominee.line2 || null,
        line3: data.nominee.line3 || null,
        city: data.nominee.city,
        postal_code: data.nominee.postal_code,
        state: data.nominee.state?.value || null,
        country: data.nominee.country?.value || null,
      };

      switch (data.nominee.identity_type.value) {
        case "PAN":
          identifier_number = data.nominee.pan;
          break;
        case "AADHAR_CARD":
          identifier_number = data.nominee.adhaar;
          break;
        case "DRIVING_LICENSE":
          identifier_number = data.nominee.driving_license;
          break;
      }

      payload.identifier = {
        identifier_type: data.nominee.identity_type.value,
        identifier_number: identifier_number,
      };

      return payload;

    case "BANK": //bank details
      payload.bank = {
        account_holder_name: data.bank_account.account_holder_name,
        account_number: data.bank_account.account_number,
        bank_type: data.bank_account.bank_type.value,
        ifsc_code: data.bank_account.ifsc_code,
        bank_name: data.bank_account.bank_name,
        branch_name: data.bank_account.branch_name,
        branch_address: data.bank_account.branch_address,
        bank_owner: "SELF",
      };

      if (data.bank_account.cancelled_cheque.base64) {
        payload.cancelled_cheque = await getPayloadForBase64(
          data.bank_account.cancelled_cheque,
          data.bank_account.account_number,
          "CANCELLED_CHEQUE"
        );
      }

      return payload;

    default:
      return payload;
  }
};
