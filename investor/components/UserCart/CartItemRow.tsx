import React, { useContext } from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import moment from "moment";

import { ThemeContext } from "@niveshstar/context";
import { Button, CustomCard, FlexRow, Padding, Typography } from "@niveshstar/ui";
import { convertCurrencyToString } from "@niveshstar/utils";

interface PropsType {
  data: any;
  handleSelectItem: (data: any, purpose: "delete" | "edit") => void;
}
function CartItemRow(props: PropsType) {
  const { data, handleSelectItem } = props;
  const { themeColor } = useContext(ThemeContext);

  return (
    <CustomCard style={{ backgroundColor: themeColor.gray[3] }}>
      <FlexRow>
        <Typography style={{ flex: 1 }}>{data.scheme?.name}</Typography>
        <Padding width={8} />
        <FlexRow alignItems="center">
          <Button
            variant="outline"
            icon={<AntDesign name="edit" size={18} color={themeColor.accent[11]} />}
            onPress={() => handleSelectItem(data, "edit")}
          />
          <Padding width={8} />
          <Button
            color="danger"
            variant="outline"
            icon={<FontAwesome name="trash-o" size={18} color={themeColor.red[11]} />}
            onPress={() => handleSelectItem(data, "delete")}
          />
        </FlexRow>
      </FlexRow>

      <Padding height={16} />
      <Typography size="3" weight="medium">
        {data.is_units ? `${data.amount} Units` : convertCurrencyToString(data.amount)}
      </Typography>

      <Padding height={16} />
      <FlexRow justifyContent="space-between">
        <Typography color={themeColor.gray[10]}>
          {data.sxp_type || data.order_type} {data.freq ? ` | ${data.freq}` : ""}
          {data.start_date ? ` | Start Date: ${moment(data.start_date).format("DD MMM YYYY")}` : ""}
          {data.end_date ? ` | End Date: ${moment(data.end_date).format("DD MMM YYYY")}` : ""}
          {data.ninstallments ? ` | Inst: ${data.ninstallments}` : ""}
          {data.type === "SXP" ? ` | First order today: ${data.first_order_today}` : ""}
        </Typography>
        {data.start_date && moment(data.start_date).isBefore(moment().startOf("day").add(4, "days")) ? (
          <Typography weight="bold" color={themeColor.red[9]}>
            Start Date Expired
          </Typography>
        ) : null}
      </FlexRow>
    </CustomCard>
  );
}

export default React.memo(CartItemRow);
