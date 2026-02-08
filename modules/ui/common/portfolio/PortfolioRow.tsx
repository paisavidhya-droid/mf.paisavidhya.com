import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";

import { colors } from "@niveshstar/constant";
import { convertCurrencyToString } from "@niveshstar/utils";

import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import { CellPropsType, ColumnsType } from "../../Table";
import Typography from "../../Typography";
import CollapsibleFunds from "./CollapsibleFunds";
import { PurposeType } from "./Portfolio";

interface PropsType {
  handleSelectScheme: (scheme: any, purpose: PurposeType) => void;
}

export default function PortfolioRow(props: CellPropsType & PropsType) {
  const { val, initialColumns, handleSelectScheme, selectedColumns, flexKey } = props;
  const [isFundsClosed, setIsFundsClosed] = useState(true);

  const handleToggle = () => {
    setIsFundsClosed(!isFundsClosed);
  };

  const schemes = [];
  Object.keys(val.schemes).forEach((key) => {
    schemes.push(val.schemes[key]);
  });

  const RenderRow = (columns: ColumnsType[]) => {
    return columns.map((col, index) => (
      <View
        key={`cell-${col.key}-${index}`}
        style={[styles.cell, col.key === flexKey ? { flex: 1, minWidth: col.width } : { width: col.width }]}
      >
        {col.key === flexKey ? (
          <TouchableOpacity onPress={handleToggle}>
            <FlexRow vCenter>
              <Typography size="h6">{val[col.key]}</Typography>
              <Padding width={10} />
              <Entypo name="chevron-down" size={14} color="black" />
            </FlexRow>
          </TouchableOpacity>
        ) : (
          <Typography size="h6">{col.rupee ? convertCurrencyToString(val[col.key]) : val[col.key]}</Typography>
        )}
      </View>
    ));
  };

  return (
    <View>
      <FlexRow noWrap>
        {RenderRow(initialColumns)}
        {RenderRow(selectedColumns)}
      </FlexRow>
      <Collapsible collapsed={isFundsClosed}>
        <CollapsibleFunds data={schemes} handleSelectScheme={handleSelectScheme} />
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cell: {
    padding: 10,
    paddingVertical: 15,
  },
  header: {
    padding: 10,
    backgroundColor: colors.lightGray,
    flexDirection: "row",
    alignItems: "center",
  },
});
