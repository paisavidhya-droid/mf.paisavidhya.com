import React, { useContext } from "react";
import { View } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { Control } from "react-hook-form";

import { ThemeContext } from "@niveshstar/context";

import Button from "../../Button";
import ControlledInput from "../../ControlledInput";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";

interface PropsType {
  control: Control<any>;
  onPressFilter: () => void;
}

function SearchFunds(props: PropsType) {
  const { control, onPressFilter } = props;

  const { themeColor } = useContext(ThemeContext);

  return (
    <FlexRow alignItems="center">
      <View style={{ flexGrow: 1 }}>
        <ControlledInput name="query" control={control} placeholder="&#x1F50D; Search Funds" inputMode="search" />
      </View>
      <Padding width={8} />
      <FlexRow alignItems="center" style={{ paddingBottom: 16 }}>
        <Button
          title="Filter"
          variant="outline"
          onPress={onPressFilter}
          style={{ paddingVertical: 6 }}
          icon={<Foundation name="filter" size={18} color={themeColor.accent[11]} style={{ marginRight: 8 }} />}
        />
      </FlexRow>
    </FlexRow>
  );
}

export default React.memo(SearchFunds);
