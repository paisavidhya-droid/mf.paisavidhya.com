import React, { useContext } from "react";
import moment from "moment";

import { countryOptions, nomineeIdentityTypeOptions, relationShipOptions, stateOptions } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";
import { Button, CustomCard, FlexRow, Padding, Typography } from "@niveshstar/ui";

interface PropsType {
  data: any;
  index: number;
  handleEditClick: (e: number) => void;
  isDisabled: boolean;
}

function NomineeRow(props: PropsType) {
  const { data, index, handleEditClick, isDisabled } = props;
  const { themeColor } = useContext(ThemeContext);
  return (
    <CustomCard style={{ backgroundColor: themeColor.gray[3] }}>
      <FlexRow style={{ justifyContent: "space-between" }}>
        <Typography align="left" size="4" weight="medium">
          Nominee #{index + 1}
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
          DOB:&nbsp;
        </Typography>
        <Typography size="1">{data?.date_of_birth ? moment(data.date_of_birth).format("D MMMM YYYY") : "-"}</Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Relationship:&nbsp;
        </Typography>
        <Typography size="1">
          {data?.relationship && typeof data.relationship === "string"
            ? relationShipOptions.find((val) => val.value === data.relationship)?.name || data.relationship
            : "-"}
        </Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Nomination Percent:&nbsp;
        </Typography>
        <Typography size="1">{data?.nomination_percent || "-"}</Typography>
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
          Line 1:&nbsp;
        </Typography>
        <Typography size="1">{data?.line1 || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Line 2:&nbsp;
        </Typography>
        <Typography size="1">{data?.line2 || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Line 3:&nbsp;
        </Typography>
        <Typography size="1">{data?.line3 || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          City:&nbsp;
        </Typography>
        <Typography size="1">{data?.city || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          State:&nbsp;
        </Typography>
        <Typography size="1">
          {data?.state && typeof data.state === "string"
            ? stateOptions.find((val) => val.value === data.state)?.name || data.state
            : "-"}
        </Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Postal Code:&nbsp;
        </Typography>
        <Typography size="1">{data?.postal_code || "-"}</Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Country:&nbsp;
        </Typography>
        <Typography size="1">
          {data?.country && typeof data.country === "string"
            ? countryOptions.find((val) => val.value === data.country)?.name || data.country
            : "-"}
        </Typography>
      </FlexRow>

      <Padding height={8} />
      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Identifier:&nbsp;
        </Typography>
        <Typography size="1">
          {data?.identifier.length
            ? nomineeIdentityTypeOptions.find((val) => val.value === data.identifier[0].identifier_type)?.name ||
              data.identifier[0].identifier_type
            : "-"}
        </Typography>
      </FlexRow>

      <Padding height={8} />
      <FlexRow>
        <Typography size="1" color={themeColor.gray[11]} weight="medium">
          Identifier Number:&nbsp;
        </Typography>
        <Typography size="1">{data?.identifier[0].identifier_number || "-"}</Typography>
      </FlexRow>
    </CustomCard>
  );
}

export default React.memo(NomineeRow);
