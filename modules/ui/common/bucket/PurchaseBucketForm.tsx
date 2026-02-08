import React, { useContext, useMemo } from "react";
import { View } from "react-native";
import { Control } from "react-hook-form";

import { sipDurationOptions } from "@niveshstar/constant";
import { ScreenContext, ThemeContext } from "@niveshstar/context";
import { convertCurrencyToString } from "@niveshstar/utils";

import Column from "../../Column";
import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

interface PropsType {
  control: Control<any>;
  schemeList: any[];
  portfolioAmount: string;
  folioOptions: { name: string; value: string }[];
}

function PurchaseBucketForm(props: PropsType) {
  const { control, schemeList, portfolioAmount } = props;

  const { themeColor } = useContext(ThemeContext);
  const { screenType } = useContext(ScreenContext);

  const minValKey = useMemo(() => {
    if (schemeList.length === 0) return "";
    return schemeList[0].type;
  }, [schemeList]);

  const minValue = useMemo(() => {
    const tmpMinVal = [];

    for (const val of schemeList) {
      if (!val.value) {
        tmpMinVal.push({ SIP: null, LUMPSUM: null });
        continue;
      }

      const scheme = val.value;
      const entry = { SIP: null, LUMPSUM: null };

      if (scheme && scheme.sip_allowed && scheme?.bse_details?.length && scheme.bse_details[0]?.SIPS?.amount?.min) {
        entry["SIP"] = scheme.bse_details[0]?.SIPS?.amount?.min;
      }

      if (scheme && scheme?.bse_details?.length && scheme?.bse_details[0]?.purchaseAmount?.freshMin) {
        entry["LUMPSUM"] = scheme?.bse_details[0]?.purchaseAmount?.freshMin;
      }

      tmpMinVal.push(entry);
    }

    return tmpMinVal;
  }, [schemeList]);

  return (
    <FlexRow style={{ flexDirection: "column-reverse" }} alignItems="stretch">
      {schemeList.map((val, index) => (
        <View key={index}>
          <CustomCard style={{ backgroundColor: themeColor.gray[2] }}>
            <Typography size="3" weight="medium">
              {val.scheme_name}
            </Typography>
            <Padding height={16} />

            <ControlledInput
              disabled
              control={control}
              label={`Amount (${val.allocation_perc}%)`}
              keyboardType="numeric"
              inputMode="numeric"
              placeholder="Enter Investment Amount"
              name={`scheme_list.${index}.amount`}
              subtitleContent={
                !minValKey || minValue[index][minValKey] === null ? null : (
                  <Typography size="1" color={themeColor.gray[10]}>
                    Minimum amount: {convertCurrencyToString(minValue[index][minValKey])}
                  </Typography>
                )
              }
              rules={{
                required: {
                  value: false,
                  message: "Please enter investment amount",
                },
                validate: (v: string) => {
                  if (!minValKey || !v || !portfolioAmount) return true;

                  const percent = parseFloat(val.allocation_perc);
                  const totalAmt = parseFloat(portfolioAmount);
                  const minAllowed = minValue[index][minValKey];

                  if (isNaN(totalAmt)) return "Total portfolio amount is not valid";

                  const currentAmt = (totalAmt * percent) / 100;

                  if (currentAmt < minAllowed) {
                    const minAmountStr = convertCurrencyToString(minAllowed);
                    return `Minimum required: ${minAmountStr} | ${percent}% of ${convertCurrencyToString(totalAmt)} = ${convertCurrencyToString(currentAmt)}`;
                  }

                  return true;
                },
              }}
            />
          </CustomCard>
          <Padding height={16} />
        </View>
      ))}

      <Padding height={16} />

      <ControlledInput
        control={control}
        label="Portfolio Amount"
        key="portfolio_amount"
        name="portfolio_amount"
        placeholder="Enter Portfolio Amount"
        keyboardType="numeric"
        inputMode="numeric"
        rules={{
          required: {
            value: true,
            message: "Please enter portfolio amount",
          },
        }}
      />

      <Padding height={16} />

      {schemeList.length && schemeList[0].type === "LUMPSUM" ? null : (
        <FlexRow offset={8} rowGap={16} wrap>
          <Column col={screenType === "sm" ? 24 : 12} offset={8}>
            <ControlledDropDown
              control={control}
              label="Debit Date"
              name="debit_date"
              placeholder="Select Debit Date"
              options={[]}
              rules={{
                required: {
                  value: true,
                  message: "Please select debit date",
                },
              }}
            />
          </Column>
          <Column col={screenType === "sm" ? 24 : 12} offset={8}>
            <ControlledDropDown
              control={control}
              label="Duration"
              name="duration"
              placeholder="Select Duration"
              options={sipDurationOptions}
              rules={{
                required: {
                  value: true,
                  message: "Please select duration",
                },
              }}
            />
          </Column>
        </FlexRow>
      )}
    </FlexRow>
  );
}

export default React.memo(PurchaseBucketForm);
