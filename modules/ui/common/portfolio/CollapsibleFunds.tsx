import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { MenuItem } from "react-native-material-menu";

import { colors } from "@niveshstar/constant";

import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Table, { ColumnsType } from "../../Table";
import Typography from "../../Typography";
import { PurposeType } from "./Portfolio";

interface PropsType {
  data: any;
  handleSelectScheme: (scheme: any, purpose: PurposeType) => void;
}

export default function CollapsibleFunds(props: PropsType) {
  const { data, handleSelectScheme } = props;

  const initialColumns: ColumnsType[] = useMemo(
    () => [
      {
        key: "scheme",
        name: "scheme",
        width: 250,
        maxWidth: 250,
        rupee: false,
        RenderCell: ({ value }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                handleSelectScheme(value, "transaction");
              }}
            >
              <Typography color={colors.primary}>{value.scheme}</Typography>
            </TouchableOpacity>
          );
        },
      },
      { key: "folio", name: "folio", width: 150, rupee: false },
      { key: "unit", name: "unit", width: 150, rupee: false },
      { key: "nav", name: "nav", width: 130, rupee: false },
      { key: "amount", name: "amount", width: 120, rupee: false },
      { key: "cval", name: "cval", width: 120, rupee: false },
      { key: "gain", name: "gain", width: 120, rupee: false },
      { key: "abs", name: "abs", width: 120, rupee: false },
      // {
      //   key: "xiir",
      //   name: "xiir",
      //   width: 120,
      //   rupee: false,
      //   RenderCell: ({ value }) => {
      //     return (
      //       <FlexRow vCenter>
      //         <Typography>{value.xiir}</Typography>
      //         <Padding width={10} />
      //         <MenuVerticalDots iconSize={10}>
      //           <MenuItem
      //             onPress={() => {
      //               handleSelectScheme(value, "lumpsum");
      //             }}
      //           >
      //             <Typography>Lumpsum</Typography>
      //           </MenuItem>
      //           <MenuItem
      //             onPress={() => {
      //               handleSelectScheme(value, "redeem");
      //             }}
      //           >
      //             <Typography>Redeem</Typography>
      //           </MenuItem>
      //           <MenuItem
      //             onPress={() => {
      //               handleSelectScheme(value, "transfer");
      //             }}
      //           >
      //             <Typography>Transfer</Typography>
      //           </MenuItem>
      //           <MenuItem
      //             onPress={() => {
      //               handleSelectScheme(value, "stp");
      //             }}
      //           >
      //             <Typography>STP</Typography>
      //           </MenuItem>
      //           <MenuItem
      //             onPress={() => {
      //               handleSelectScheme(value, "swp");
      //             }}
      //           >
      //             <Typography>SWP</Typography>
      //           </MenuItem>
      //         </MenuVerticalDots>
      //       </FlexRow>
      //     );
      //   },
      // },
    ],
    []
  );

  return (
    <View>
      <Table data={data} id="id" initialColumns={initialColumns} flexKey="scheme" noFlatList />
    </View>
  );
}
