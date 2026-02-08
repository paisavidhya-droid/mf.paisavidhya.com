import React, { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Control, useForm } from "react-hook-form";

import { ThemeContext } from "@niveshstar/context";
import { convertCurrencyToString } from "@niveshstar/utils";

import Button from "./Button";
import ControlledCheckbox from "./ControlledCheckbox";
import CustomModal from "./CustomModal";
import Divider from "./Divider";
import EmptyResult from "./EmptyResult";
import FlexRow from "./FlexRow";
import Padding from "./Padding";
import Typography, { TextAlignment } from "./Typography";

export type CellPropsType = {
  val: any;
  index: number;
  initialColumns: ColumnsType[];
  flexKey?: string;
  selectedColumns: ColumnsType[];
  lastColumn?: ColumnsType;
  selection?: boolean;
  control?: Control<any>;
  hiddenSelectionIndices?: Set<number>;
  showIndex?: boolean;
};

export type ColumnsType = {
  key: string;
  name: string;
  width: number;
  rupee?: boolean;
  RenderCell?: React.FC<{ value: any; index: number }>;
  sortable?: boolean;
  maxWidth?: number;
  headerAlignment?: "flex-start" | "flex-end" | "center";
  textAlign?: TextAlignment;
  hideSelection?: false;
};

interface PropsType {
  data: any;
  initialColumns: ColumnsType[];
  RenderRow?: React.FC<CellPropsType>;
  id: string;
  flexKey?: string;
  noFlatList?: boolean;
  optionalColumns?: ColumnsType[];
  TopActionRow?: React.ReactNode;
  lastColumn?: ColumnsType;
  selection?: boolean;
  control?: Control<any>;
  hiddenSelectionIndices?: Set<number>;
}

function Table(props: PropsType) {
  const {
    data,
    initialColumns,
    id,
    RenderRow,
    flexKey,
    noFlatList = false,
    optionalColumns = [],
    lastColumn = null,
    TopActionRow,
    selection = false,
    control: parentFormControl,
    hiddenSelectionIndices,
  } = props;

  const [tableData, setTableData] = useState([]);
  const [sortkey, setSortKey] = useState({ key: null, order: 1 });
  const [isColumnModalVisible, setIsColumnModalVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<ColumnsType[]>([]);
  const { themeColor } = useContext(ThemeContext);

  const defaultValues = {};
  optionalColumns.forEach((val) => (defaultValues[val.key] = false));

  const { control, handleSubmit, watch } = useForm({
    defaultValues: { ...defaultValues, showIndex: false },
    reValidateMode: "onSubmit",
  });

  const showIndex = watch("showIndex");

  const openColumnModal = useCallback(() => setIsColumnModalVisible(true), []);
  const closeColumnModal = useCallback(() => setIsColumnModalVisible(false), []);

  const handleSelectColumns = useCallback(
    (data: any) => {
      const tmpCol = [];

      Object.keys(data).forEach((key) => {
        if (!data[key] || key === "showIndex") return;
        const res = optionalColumns.filter((val) => val.key === key);
        tmpCol.push(res[0]);
      });

      setSelectedColumns(tmpCol);
      closeColumnModal();
    },
    [closeColumnModal, optionalColumns]
  );

  const handleSort = useCallback(
    (key: string) => () => {
      let order = sortkey.order;
      if (sortkey.key === key) order *= -1;
      else order = 1;

      setSortKey({ key: key, order: order });
    },
    [sortkey]
  );

  useEffect(() => {
    if (!sortkey.key) return;

    const tmpTableData = [...tableData];
    tmpTableData.sort((a, b) => {
      const isString = isNaN(Number(a[sortkey.key]));
      if (isString) {
        const res = b[sortkey.key].localeCompare(a[sortkey.key]) * sortkey.order;
        return res;
      }
      const res = (a[sortkey.key] - b[sortkey.key]) * sortkey.order;
      return res;
    });

    setTableData(tmpTableData);
  }, [sortkey.key, sortkey.order, tableData]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const RenderHeader = useCallback(
    (columns: ColumnsType[]) => {
      return columns.map((col, index) => (
        <View
          key={`header-${col.key}-${index}`}
          style={[
            styles.header,
            {
              minWidth: col.width,
              maxWidth: col.maxWidth,
              justifyContent: col.headerAlignment || "flex-start",
            },
            col.key === flexKey ? { flexGrow: 1 } : {},
          ]}
        >
          <Typography weight="bold">{col.name}</Typography>
          {col.sortable ? (
            <>
              <Padding width={8} />
              <Pressable onPress={handleSort(col.key)}>
                {!(sortkey.key !== col.key || sortkey.order === 1) ? null : (
                  <FontAwesome5
                    name="arrow-circle-up"
                    size={16}
                    color={sortkey.key === col.key && sortkey.order === 1 ? themeColor.green[9] : themeColor.gray[11]}
                  />
                )}
                {!(sortkey.key === col.key && sortkey.order === -1) ? null : (
                  <FontAwesome5 name="arrow-circle-down" size={16} color={themeColor.gray[11]} />
                )}
              </Pressable>
            </>
          ) : null}
        </View>
      ));
    },
    [flexKey, handleSort, sortkey, themeColor]
  );

  return (
    <View style={styles.container}>
      <FlexRow justifyContent="flex-end">
        {TopActionRow ? TopActionRow : null}
        {optionalColumns.length === 0 ? null : (
          <>
            {TopActionRow ? <Padding width={8} /> : null}
            <Button
              variant="soft"
              title="Columns"
              onPress={openColumnModal}
              icon={
                <Ionicons name="settings-sharp" size={16} color={themeColor.accent[11]} style={{ marginRight: 8 }} />
              }
            />
          </>
        )}
      </FlexRow>
      {TopActionRow || optionalColumns.length ? <Padding height={10} /> : null}
      <ScrollView
        persistentScrollbar
        horizontal
        contentContainerStyle={[styles.wrapper, { borderColor: themeColor.gray[6] }]}
      >
        <View style={{ flexGrow: 1 }}>
          <View style={[styles.headerWrapper, { backgroundColor: themeColor.gray["a2"] }]}>
            <FlexRow>
              {selection ? (
                <View style={styles.header}>
                  <ControlledCheckbox control={parentFormControl} name="select_all" label="" />
                </View>
              ) : null}
              {showIndex ? (
                <View style={styles.header}>
                  <Typography weight="bold">#</Typography>
                </View>
              ) : null}
              {RenderHeader(initialColumns)}
              {RenderHeader(selectedColumns)}
              {lastColumn === null ? null : RenderHeader([lastColumn])}
            </FlexRow>
          </View>
          {tableData && tableData.length !== 0 ? null : <EmptyResult style={{ minHeight: 150 }} />}
          {noFlatList ? (
            tableData.map((item: any, i: number) => {
              if (RenderRow)
                return (
                  <View key={`cell-table-${i}`}>
                    <RenderRow
                      index={i}
                      val={item}
                      flexKey={flexKey}
                      selection={selection}
                      showIndex={showIndex}
                      lastColumn={lastColumn}
                      control={parentFormControl}
                      initialColumns={initialColumns}
                      selectedColumns={selectedColumns}
                      hiddenSelectionIndices={hiddenSelectionIndices}
                    />
                    {i === tableData.length - 1 ? null : <Divider />}
                  </View>
                );
              else
                return (
                  <View key={`cell-table-${i}`}>
                    <Cell
                      index={i}
                      val={item}
                      flexKey={flexKey}
                      selection={selection}
                      showIndex={showIndex}
                      lastColumn={lastColumn}
                      control={parentFormControl}
                      initialColumns={initialColumns}
                      selectedColumns={selectedColumns}
                      hiddenSelectionIndices={hiddenSelectionIndices}
                    />
                    {i === tableData.length - 1 ? null : <Divider />}
                  </View>
                );
            })
          ) : (
            <FlatList
              data={tableData}
              keyExtractor={(item) => item[id]}
              nestedScrollEnabled={true}
              ItemSeparatorComponent={Divider}
              renderItem={({ item, index }) => {
                if (RenderRow)
                  return (
                    <RenderRow
                      val={item}
                      index={index}
                      key={item[id]}
                      flexKey={flexKey}
                      selection={selection}
                      showIndex={showIndex}
                      lastColumn={lastColumn}
                      control={parentFormControl}
                      initialColumns={initialColumns}
                      selectedColumns={selectedColumns}
                      hiddenSelectionIndices={hiddenSelectionIndices}
                    />
                  );
                else
                  return (
                    <Cell
                      val={item}
                      index={index}
                      key={item[id]}
                      flexKey={flexKey}
                      selection={selection}
                      showIndex={showIndex}
                      lastColumn={lastColumn}
                      control={parentFormControl}
                      initialColumns={initialColumns}
                      selectedColumns={selectedColumns}
                      hiddenSelectionIndices={hiddenSelectionIndices}
                    />
                  );
              }}
            />
          )}
        </View>
      </ScrollView>
      <CustomModal
        heightPercent={70}
        footerTitle="Apply"
        title="Select Columns"
        closeModal={closeColumnModal}
        isModalVisible={isColumnModalVisible}
        onConfirm={handleSubmit(handleSelectColumns)}
      >
        <View style={{ minHeight: 200 }}>
          <View>
            <ControlledCheckbox control={control} name="showIndex" label="Show Row Number" />
            <Padding height={10} />
          </View>
          {optionalColumns.map((val: ColumnsType, i: number) => (
            <View key={val.key}>
              <ControlledCheckbox control={control} name={val.key} label={val.name} />
              {i === optionalColumns.length - 1 ? null : <Padding height={10} />}
            </View>
          ))}
        </View>
      </CustomModal>
    </View>
  );
}

function CellComponent(props: CellPropsType) {
  const {
    val,
    index,
    initialColumns,
    flexKey,
    selectedColumns,
    lastColumn,
    selection,
    control,
    hiddenSelectionIndices,
    showIndex,
  } = props;
  const { themeColor } = useContext(ThemeContext);
  return (
    <FlexRow style={{ backgroundColor: themeColor.gray[1] }}>
      {selection ? (
        <View style={styles.cell}>
          {hiddenSelectionIndices && hiddenSelectionIndices.has(index) ? (
            <View style={{ width: 30, height: 20 }} />
          ) : (
            <ControlledCheckbox control={control} name={`selection.${val.id}`} label="" />
          )}
        </View>
      ) : null}
      {showIndex ? (
        <View style={styles.cell}>
          <Typography color={themeColor.gray[9]}>{index}</Typography>
        </View>
      ) : null}
      {initialColumns.map((col, index) => (
        <View
          key={`cell-${col.key}-${index}`}
          style={[
            styles.cell,
            {
              width: col.width,
              maxWidth: col.maxWidth,
            },
            col.key === flexKey ? { flexGrow: 1 } : {},
          ]}
        >
          {col.RenderCell ? (
            <col.RenderCell value={val} index={index} />
          ) : (
            <Typography align={col.textAlign}>
              {col.rupee ? convertCurrencyToString(val[col.key]) : val[col.key]}
            </Typography>
          )}
        </View>
      ))}
      {selectedColumns.map((col, index) => (
        <View
          key={`cell-${col.key}-${index}`}
          style={[
            styles.cell,
            {
              width: col.width,
              maxWidth: col.maxWidth,
            },
            col.key === flexKey ? { flexGrow: 1 } : {},
          ]}
        >
          {col.RenderCell ? (
            <col.RenderCell value={val} index={index} />
          ) : (
            <Typography align={col.textAlign}>
              {col.rupee ? convertCurrencyToString(val[col.key]) : val[col.key]}
            </Typography>
          )}
        </View>
      ))}
      {lastColumn === null ? (
        <></>
      ) : (
        <View
          style={[
            styles.cell,
            {
              width: lastColumn.width,
              maxWidth: lastColumn.maxWidth,
            },
            lastColumn.key === flexKey ? { flexGrow: 1 } : {},
          ]}
        >
          {lastColumn.RenderCell ? (
            <lastColumn.RenderCell value={val} index={index} />
          ) : (
            <Typography align={lastColumn.textAlign}>
              {lastColumn.rupee ? convertCurrencyToString(val[lastColumn.key]) : val[lastColumn.key]}
            </Typography>
          )}
        </View>
      )}
    </FlexRow>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flexGrow: 1,
    paddingBottom: 8,
    borderWidth: 1,
    borderRadius: 12,
  },
  cell: {
    padding: 10,
    paddingVertical: 15,
  },
  headerWrapper: {
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

// export default memo(Table, (oldProps, newProps) => {
//     return JSON.stringify(oldProps) === JSON.stringify(newProps);
// })
const Cell = React.memo(CellComponent);

export default React.memo(Table);
