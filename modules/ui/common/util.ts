import moment from "moment";
import { UseFormSetValue } from "react-hook-form";

import {
  addressTypeOptions,
  bankAccountTypeOptions,
  countryOptions,
  genderOptions,
  incomeSlabOptions,
  nomineeIdentityTypeOptions,
  occupationOptions,
  pepDetailsOptions,
  relationShipOptions,
  sourceOfWealthOptions,
  stateOptions,
} from "@niveshstar/constant";

type UpdateType = "PERSONAL" | "ADDRESS" | "BANK" | "COMMUNICATION" | "NOMINEE" | "HOLDER";

export const updateInvestorForm = (
  data: any,
  setValue: UseFormSetValue<any>,
  updateType: UpdateType,
  index: number = 0
) => {
  if (updateType === "PERSONAL") {
    setValue("first_name", data?.first_name);
    setValue("middle_name", data?.middle_name || "");
    setValue("last_name", data?.last_name);
    setValue("pan", data.pan);

    const gender = genderOptions.filter((item) => item.value === data.gender);
    setValue("gender", gender[0]);

    // const marital_status = martialStatusOptions.filter((item) => item.value === data.marital_status);
    // setValue("marital_status", marital_status[0]);

    const date_of_birth = data.date_of_birth;
    const dob = moment(date_of_birth).format("YYYY-MM-DD");
    setValue("date_of_birth", dob as any);

    const occupation = occupationOptions.filter((item) => item.value === data.occupation);
    if (occupation.length) setValue("occupation", occupation[0]);

    const income_slab = incomeSlabOptions.filter((item) => item.value === data.income_slab);
    if (income_slab.length) setValue("income_slab", income_slab[0]);

    const source_of_wealth = sourceOfWealthOptions.filter((item) => item.value === data.source_of_wealth);
    if (source_of_wealth.length) setValue("source_of_wealth", source_of_wealth[0]);

    // setValue("holding_nature", data.holding_nature);
    setValue("tax_status", data.tax_status);
    setValue("place_of_birth", data.place_of_birth);
    setValue("tin_no", data.tin_no);

    const tin_country = countryOptions.filter((item) => item.value === data.tin_country);
    if (tin_country.length) setValue("tin_country", tin_country[0]);

    const country_of_birth = countryOptions.filter((item) => item.value === data.country_of_birth);
    if (country_of_birth.length) setValue("country_of_birth", country_of_birth[0]);

    const pep_details = pepDetailsOptions.filter((item) => item.value === data.pep_details);
    if (pep_details.length) setValue("pep_details", pep_details[0]);
  }

  if (updateType === "ADDRESS") {
    const address = data.address;
    if (address) {
      setValue("address.line1", address.line1);
      setValue("address.line2", address.line2);
      setValue("address.line3", address.line3);

      const state = address.state;
      setValue("address.state", { value: state, name: state });

      const country = countryOptions.filter((item) => item.value === address.country);
      if (country.length) setValue("address.country", country[0]);

      setValue("address.city", address.city);
      setValue("address.postal_code", address.postal_code);

      const type = addressTypeOptions.filter((item) => item.value === address.type);
      if (type.length) setValue("address.type", type[0]);
    }
  }

  if (updateType === "COMMUNICATION") {
    const email = data.email_address;
    if (email) {
      setValue("email.email", email.email);
      setValue("email_address.email", email.email);
      // setValue("email_address.id", email.id);
      setValue("email_address.belongs_to", email.belongs_to);
    }

    const phone = data.phone_number;
    if (phone) {
      setValue("phone.number", phone.number);
      setValue("phone_number.number", phone.number);
      setValue("phone_number.isd", phone.isd);
      setValue("phone_number.belongs_to", phone.belongs_to);
      setValue("phone_number.type", phone.type);
      // setValue("phone_number.id", phone.id);
    }
  }

  if (updateType === "NOMINEE") {
    const nominee = data.related_party && data.related_party.length >= index ? data.related_party[index] : null;
    if (nominee) {
      // setValue("nominee.id", nominee.id);

      setValue("nominee.first_name", nominee.first_name);
      setValue("nominee.middle_name", nominee.middle_name);
      setValue("nominee.last_name", nominee.last_name);

      const nomineeRealtion = relationShipOptions.filter((item) => item.value === nominee.relationship);
      if (nomineeRealtion.length) setValue("nominee.relationship", nomineeRealtion[0]);

      const nominee_dob = nominee.date_of_birth;
      const nominee_date_of_brith = moment(nominee_dob).format("YYYY-MM-DD");
      setValue("nominee.date_of_birth", nominee_date_of_brith);

      if (nominee.identifier && nominee.identifier.length) {
        const identifier = nominee.identifier[0];
        const nomineeIdType = nomineeIdentityTypeOptions.filter((item) => item.value === identifier.identifier_type);
        if (nomineeIdType.length) setValue("nominee.identity_type", nomineeIdType[0]);

        if (identifier.identifier_type === "PAN") setValue("nominee.pan", identifier.identifier_number);
        if (identifier.identifier_type === "AADHAR_CARD") setValue("nominee.adhaar", identifier.identifier_number);
        if (identifier.identifier_type === "DRIVING_LICENSE")
          setValue("nominee.driving_license", identifier.identifier_number);
      }

      setValue("nominee.email", nominee?.email || "");
      setValue("nominee.mobile", nominee?.mobile || "");
      setValue("nominee.line1", nominee?.line1 || "");
      setValue("nominee.line2", nominee?.line2 || "");
      setValue("nominee.line3", nominee?.line3 || "");
      setValue("nominee.postal_code", nominee?.postal_code || "");
      setValue("nominee.city", nominee?.city || "");

      const nomineeState = stateOptions.filter((item) => item.value === nominee.state);
      if (nomineeState.length) setValue("nominee.state", nomineeState[0]);

      const nomineeCountry = countryOptions.filter((item) => item.value === nominee.country);
      if (nomineeCountry.length) setValue("nominee.country", nomineeCountry[0]);

      // Copy to check if nominee updated
      // setValue('old_nominee.id', nominee.id);
      // setValue('old_nominee.name', nominee.name);
      // setValue('old_nominee.relationship', nomineeRealtion[0]);
      // setValue('old_nominee.date_of_birth', nominee_date_of_brith);
    }
  }

  if (updateType === "BANK") {
    const bank = data.bank_account && data.bank_account.length >= index ? data.bank_account[index] : null;
    if (bank) {
      setValue("bank_account.account_holder_name", bank.account_holder_name);
      setValue("bank_account.account_number", bank.account_number);
      setValue("bank_account.ifsc_code", bank.ifsc_code);

      const bankType = bankAccountTypeOptions.filter((val) => val.value === bank.bank_type);
      if (bankType.length) setValue("bank_account.bank_type", bankType[0]);

      setValue("bank_account.bank_owner", bank.bank_owner);
      setValue("bank_account.bank_name", bank.bank_name);
      setValue("bank_account.branch_name", bank.branch_name);
      setValue("bank_account.branch_address", bank.branch_address);
      setValue("bank_account.cancelled_cheque", bank.cancelled_cheque);
    }
  }

  if (updateType === "HOLDER") {
    const holder = data.holder && data.holder.length >= index ? data.holder[index] : null;
    if (holder) {
      setValue("holder.first_name", holder?.first_name);
      setValue("holder.middle_name", holder?.middle_name || "");
      setValue("holder.last_name", holder?.last_name);
      setValue("holder.email", holder.email);
      setValue("holder.mobile", holder.mobile);

      const gender = genderOptions.filter((item) => item.value === holder.gender);
      setValue("holder.gender", gender[0]);

      const date_of_birth = holder.date_of_birth;
      const dob = moment(date_of_birth).format("YYYY-MM-DD");
      setValue("holder.date_of_birth", dob as any);

      const occupation = occupationOptions.filter((item) => item.value === holder.occupation);
      if (occupation.length) setValue("holder.occupation", occupation[0]);

      const income_slab = incomeSlabOptions.filter((item) => item.value === holder.income_slab);
      if (income_slab.length) setValue("holder.income_slab", income_slab[0]);

      const source_of_wealth = sourceOfWealthOptions.filter((item) => item.value === holder.source_of_wealth);
      if (source_of_wealth.length) setValue("holder.source_of_wealth", source_of_wealth[0]);

      setValue("holder.place_of_birth", holder.place_of_birth);

      const country_of_birth = countryOptions.filter((item) => item.value === holder.country_of_birth);
      if (country_of_birth.length) setValue("holder.country_of_birth", country_of_birth[0]);

      const pep_details = pepDetailsOptions.filter((item) => item.value === holder.pep_details);
      if (pep_details.length) setValue("holder.pep_details", pep_details[0]);

      if (holder.identifier && holder.identifier.length) {
        const identifier = holder.identifier[0];
        const holderIdType = nomineeIdentityTypeOptions.filter((item) => item.value === identifier.identifier_type);
        if (holderIdType.length) setValue("nominee.identity_type", holderIdType[0]);

        if (identifier.identifier_type === "PAN") setValue("holder.pan", identifier.identifier_number);
        if (identifier.identifier_type === "AADHAR_CARD") setValue("holder.adhaar", identifier.identifier_number);
        if (identifier.identifier_type === "DRIVING_LICENSE")
          setValue("holder.driving_license", identifier.identifier_number);
      }
    }
  }
};