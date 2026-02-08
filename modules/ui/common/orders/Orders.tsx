import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";

import {
  RootStateType,
  ThemeContext,
  useGetAllOrdersListQuery,
  useLazyGetOrderBseDetailsQuery,
  useLazyGetSxpBseDetailsQuery,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { convertCurrencyToString, getOrderStatusDisplay } from "@niveshstar/utils";

import Button from "../../Button";
import CustomCard from "../../CustomCard";
import CustomModal from "../../CustomModal";
import EmptyResult from "../../EmptyResult";
import FlexRow from "../../FlexRow";
import Table, { ColumnsType } from "../../Table";
import Typography from "../../Typography";
import OrderDetailsModal from "./OrderDetailsModal";
import SxpDetailsModal from "./SxpDetailsModal";

function Orders() {
  const { params } = useNavigation();
  const { themeColor, isLight } = useContext(ThemeContext);
  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({ id: null, type: null });

  const closeDetailsModal = useCallback(() => {
    setSelectedOrder({ id: null, type: null });
    setIsDetailsModalVisible(false);
  }, []);

  const openDetailsModal = useCallback(() => {
    setIsDetailsModalVisible(true);
  }, []);

  const investorId = authDetail.userType === "investor" ? authDetail.id : params?.investorId;

  const { data: ordersData = { list: [], total: 0, limit: 0, page: 1 }, isFetching } = useGetAllOrdersListQuery(
    {
      page: 1,
      limit: 999,
      investorId: authDetail.userType === "partner" ? investorId : undefined,
    },
    {
      skip: !investorId,
    }
  );

  const [
    getOrderBseDetailsApi,
    { isFetching: isFetchingOrderBseDetails, data: orderBseData, isError: orderBseIsError },
  ] = useLazyGetOrderBseDetailsQuery();
  const [getSxpBseDetailsApi, { isFetching: isFetchingSxpBseDetails, data: sxpBseData, isError: sxpBseIsError }] =
    useLazyGetSxpBseDetailsQuery();

  const initialColumns: ColumnsType[] = useMemo<ColumnsType[]>(
    () => [
      {
        key: "orderId",
        name: "Order ID",
        width: 160,
        maxWidth: 350,
        RenderCell: ({ value }) => (
          <View>
            <Typography>{value.exch_order_id}</Typography>
          </View>
        ),
      },
      {
        key: "createdAt",
        name: "Time",
        width: 120,
        RenderCell: ({ value }) => {
          const date = moment(value.created_at);
          const dateStr = date.format("DD MMM YYYY");
          const timeStr = date.format("hh:mm A");

          return (
            <View>
              <Typography>{dateStr}</Typography>
              <Typography size="1" color={themeColor.gray[10]}>
                {timeStr}
              </Typography>
            </View>
          );
        },
      },
      {
        key: "schemeName",
        name: "Scheme Name",
        width: 150,
        maxWidth: 350,
        RenderCell: ({ value }) => (
          <View>
            <Typography>{value.scheme.name}</Typography>
            <Typography size="1" color={themeColor.gray[10]}>
              Folio No: {value.folio ?? "-"}
            </Typography>
          </View>
        ),
      },
      {
        key: "amount",
        name: "Amount",
        width: 150,
        RenderCell: ({ value }) => (
          <View>
            <Typography
              weight="medium"
              color={
                value.order_type === "REDEMPTION" || value.order_type === "STP" || value.order_type === "SWP"
                  ? themeColor.red[9]
                  : themeColor.gray[12]
              }
            >
              {value.order_type === "REDEMPTION" || value.order_type === "STP" || value.order_type === "SWP" ? "-" : ""}
              {value.is_units ? `${value.amount} Units` : convertCurrencyToString(value.amount)}
            </Typography>
            <Typography size="1" color={themeColor.gray[10]}>
              {value.order_type}
            </Typography>
          </View>
        ),
      },
      {
        key: "debitAccount",
        name: "Debit Account",
        width: 150,
        RenderCell: ({ value }) => (
          <View>
            <Typography>{value?.bank?.bank_name}</Typography>
            <Typography>{value?.bank?.account_number}</Typography>
            <Typography>{value?.bank?.ifsc_code}</Typography>
          </View>
        ),
      },
      {
        key: "status",
        name: "Status",
        width: 150,
        RenderCell: ({ value }) => {
          const orderStatus = getOrderStatusDisplay(value.status, isLight);
          return (
            <FlexRow>
              <View
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  borderRadius: 4,
                  backgroundColor: orderStatus.bg,
                }}
              >
                <Typography size="1" weight="light" color={orderStatus.text}>
                  {orderStatus.label}
                </Typography>
              </View>
            </FlexRow>
          );
        },
      },
      {
        key: "action",
        name: "Actions",
        width: 200,
        RenderCell: ({ value }) => (
          <Button
            color="neutral"
            variant="outline"
            title="Check Details"
            typographyProps={{ size: "1" }}
            disabled={!value.exch_order_id}
            onPress={() => setSelectedOrder({ id: value.id, type: value.type })}
          />
        ),
      },
    ],
    [isLight, themeColor]
  );

  useEffect(() => {
    if (!selectedOrder.id) return;

    if (selectedOrder.type === "ORDER") getOrderBseDetailsApi(selectedOrder.id);
    else if (selectedOrder.type === "SXP") getSxpBseDetailsApi(selectedOrder.id);

    openDetailsModal();
  }, [selectedOrder, openDetailsModal, getOrderBseDetailsApi, getSxpBseDetailsApi]);

  return (
    <CustomCard style={{ flexGrow: 1 }}>
      {isFetching ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {!isFetching && ordersData.list.length === 0 ? <EmptyResult /> : null}

      {!isFetching && ordersData.list.length !== 0 ? (
        <Table
          id="id"
          flexKey="schemeName"
          data={ordersData.list}
          initialColumns={initialColumns}
          TopActionRow={
            <FlexRow style={{ flexGrow: 1 }}>
              <Typography size="5" weight="medium" align="left">
                Orders
              </Typography>
            </FlexRow>
          }
        />
      ) : null}

      <CustomModal
        heightPercent={70}
        title={selectedOrder.type === "SXP" ? "SXP Details" : "Order Details"}
        closeModal={closeDetailsModal}
        isModalVisible={isDetailsModalVisible}
      >
        {selectedOrder.type === "SXP" ? (
          <SxpDetailsModal
            data={sxpBseData}
            id={selectedOrder.id}
            isError={sxpBseIsError}
            isLoading={isFetchingSxpBseDetails}
          />
        ) : (
          <OrderDetailsModal data={orderBseData} isError={orderBseIsError} isLoading={isFetchingOrderBseDetails} />
        )}
      </CustomModal>
    </CustomCard>
  );
}

export default React.memo(Orders);
