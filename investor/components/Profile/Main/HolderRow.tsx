import React, { useContext } from "react";
import moment from "moment";

import {
  countryOptions,
  incomeSlabOptions,
  occupationOptions,
  pepDetailsOptions,
  sourceOfWealthOptions,
} from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";
import { Button, CustomCard, FlexRow, Padding, Typography } from "@niveshstar/ui";

interface PropsType {
  data: any;
  index: number;
  handleEditClick: (e: number) => void;
  isDisabled: boolean;
}

function HolderRow(props: PropsType) {
  const { data, index, handleEditClick, isDisabled } = props;
  const { themeColor } = useContext(ThemeContext);

  return (
    <CustomCard style={{ backgroundColor: themeColor.gray[3] }}>
      <FlexRow style={{ justifyContent: "space-between" }}>
        <Typography align="left" size="4" weight="medium">
          Holder #{index + 1}
        </Typography>
        {isDisabled ? null : <Button variant="soft" title="Edit" onPress={() => handleEditClick(index)} />}
      </FlexRow>
      <Padding height={12} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          First Name:&nbsp;
        </Typography>
        <Typography size="1">{data?.first_name || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Middle Name:&nbsp;
        </Typography>
        <Typography size="1">{data?.middle_name || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Last Name:&nbsp;
        </Typography>
        <Typography size="1">{data?.last_name || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Gender:&nbsp;
        </Typography>
        <Typography size="1">{data?.gender}</Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Date of Birth:&nbsp;
        </Typography>
        <Typography size="1">{data?.date_of_birth ? moment(data.date_of_birth).format("D MMMM YYYY") : "-"}</Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Place of Birth:&nbsp;
        </Typography>
        <Typography size="1">{data?.place_of_birth || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Country of Birth:&nbsp;
        </Typography>
        <Typography size="1">
          {data?.country_of_birth && typeof data.country_of_birth === "string"
            ? countryOptions.find((val) => val.value === data.country_of_birth)?.name || data.country_of_birth
            : "-"}
        </Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Occupation:&nbsp;
        </Typography>
        <Typography size="1">
          {data?.occupation && typeof data.occupation === "string"
            ? occupationOptions.find((val) => val.value === data.occupation)?.name || data.occupation
            : "-"}
        </Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Source of Wealth:&nbsp;
        </Typography>
        <Typography size="1">
          {data?.source_of_wealth && typeof data.source_of_wealth === "string"
            ? sourceOfWealthOptions.find((val) => val.value === data.source_of_wealth)?.name || data.source_of_wealth
            : "-"}
        </Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Income Slab:&nbsp;
        </Typography>
        <Typography size="1">
          {data?.income_slab && typeof data.income_slab === "string"
            ? incomeSlabOptions.find((val) => val.value === data.income_slab)?.name || data.income_slab
            : "-"}
        </Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          PEP Details:&nbsp;
        </Typography>
        <Typography size="1">
          {data?.pep_details && typeof data.pep_details === "string"
            ? pepDetailsOptions.find((val) => val.value === data.pep_details)?.name || data.pep_details
            : "-"}
        </Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Email:&nbsp;
        </Typography>
        <Typography size="1">{data?.email || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Mobile:&nbsp;
        </Typography>
        <Typography size="1">{data?.mobile || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />

      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          PAN Number:&nbsp;
        </Typography>
        <Typography size="1">{data?.identifier?.[0]?.identifier_number || "-"}</Typography>
      </FlexRow>
    </CustomCard>
  );
}

export default React.memo(HolderRow);