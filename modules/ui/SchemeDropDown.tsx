import React, { useEffect, useMemo } from "react";
import { Control, RegisterOptions, useWatch } from "react-hook-form";

import { useLazyGetRedemptionSchemeQuery, useLazyGetSchemesQuery } from "@niveshstar/context";
import { useDebounce } from "@niveshstar/hook";

import ControlledDropDown from "./ControlledDropDown";

interface PropsType {
  name: string;
  type: "PURCHASE" | "REDEEM";
  control: Control<any>;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
}

export default function SchemeDropDown(props: PropsType) {
  const { control, name, rules, type } = props;

  const schemeName = useWatch({ name: name, control: control });
  const searchQuery = useDebounce(schemeName?.name, 300);

  const [getSchemesApi, { data: schemesData = { data: { list: [] } }, isFetching: isFetchingSchemes }] =
    useLazyGetSchemesQuery();
  const [getRedeemSchemesApi, { data: redeemSchemesData = { data: [] }, isFetching: isFetchingRedeemSchemes }] =
    useLazyGetRedemptionSchemeQuery();

  const optionsData = useMemo(() => {
    if (type === "REDEEM" && redeemSchemesData.data.length) {
      return redeemSchemesData.data.map((val: any) => ({ name: val.name, value: val }));
    } else if (type === "PURCHASE" && schemesData.data.list.length) {
      return schemesData.data.list.map((val: any) => ({ name: val.name, value: val }));
    }

    return [];
  }, [type, redeemSchemesData, schemesData]);

  useEffect(() => {
    if (type === "REDEEM") {
      getRedeemSchemesApi(undefined).unwrap();
    }
  }, [type, getRedeemSchemesApi]);

  useEffect(() => {
    if (type !== "REDEEM" && searchQuery) {
      getSchemesApi({ page: 1, limit: 10, schemeName: searchQuery }).unwrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, getSchemesApi]);

  return (
    <ControlledDropDown
      name={name}
      rules={rules}
      control={control}
      label="Select Scheme"
      options={optionsData}
      placeholder="Starting typing to search"
      isLoading={isFetchingSchemes || isFetchingRedeemSchemes}
    />
  );
}
