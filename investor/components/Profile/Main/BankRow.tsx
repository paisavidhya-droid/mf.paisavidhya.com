import React, { useContext } from "react";
import { Image, StyleSheet } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import { bankAccountTypeOptions, colors } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";
import { Button, CustomCard, FlexRow, Padding, Typography } from "@niveshstar/ui";

interface PropsType {
  data: any;
  index: number;
  handleSelectItem: (index: number, purpose: "EDIT" | "DELETE") => void;
}

function BankRow(props: PropsType) {
  const { data, index, handleSelectItem } = props;
  const { themeColor } = useContext(ThemeContext);
  return (
    <CustomCard style={{ backgroundColor: themeColor.gray[3] }}>
      <FlexRow style={{ justifyContent: "space-between" }}>
        <Typography align="left" size="4" weight="medium">
          Bank #{index + 1}
        </Typography>
        <FlexRow alignItems="center">
          <Button
            variant="outline"
            icon={<AntDesign name="edit" size={18} color={themeColor.accent[11]} />}
            onPress={() => handleSelectItem(index, "EDIT")}
          />
          <Padding width={8} />
          <Button
            color="danger"
            variant="outline"
            icon={<FontAwesome name="trash-o" size={18} color={themeColor.red[11]} />}
            onPress={() => handleSelectItem(index, "DELETE")}
          />
        </FlexRow>
      </FlexRow>
      <Padding height={12} />
      <FlexRow>
        <Typography color={themeColor.gray[11]} weight="medium">
          Account Holder Name: &nbsp;
        </Typography>
        <Typography>{data.account_holder_name}</Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography color={themeColor.gray[11]} weight="medium">
          Account Number: &nbsp;
        </Typography>
        <Typography>{data.account_number}</Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography color={themeColor.gray[11]} weight="medium">
          IFSC: &nbsp;
        </Typography>
        <Typography>{data.ifsc_code}</Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography color={themeColor.gray[11]} weight="medium">
          Bank Name: &nbsp;
        </Typography>
        <Typography>{data.bank_name}</Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography color={themeColor.gray[11]} weight="medium">
          Type: &nbsp;
        </Typography>
        <Typography>
          {bankAccountTypeOptions.find((val) => val.value === data.bank_type).name || data.bank_type}
        </Typography>
      </FlexRow>
      <Padding height={8} />
      <FlexRow>
        <Typography color={themeColor.gray[11]} weight="medium">
          Cancelled Cheque:&nbsp;
        </Typography>
        <Typography size="1">
          {data?.cancelled_cheque ? (
            <Image
              source={{ uri: data?.cancelled_cheque }}
              style={styles.img}
              resizeMode="stretch"
              resizeMethod="resize"
            />
          ) : (
            "-"
          )}
        </Typography>
      </FlexRow>
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  img: {
    backgroundColor: colors.white,
    borderRadius: 5,
    width: 200,
    height: 100,
  },
});

export default React.memo(BankRow);
