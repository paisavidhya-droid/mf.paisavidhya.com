import React, { useEffect, useState } from "react";
import moment from "moment";

import Table, { ColumnsType } from "../Table";
import Typography from "../Typography";

interface PropsType {
  data: any;
}

// getTransactionType
const transactionInitialColums: ColumnsType[] = [
  {
    key: "folio",
    name: "Folio",
    width: 150,
  },
  {
    key: "type",
    name: "Type",
    width: 150,
    RenderCell: ({ value }) => <Typography>{value.type}</Typography>,
  },
  {
    key: "date",
    name: "Date",
    width: 150,
    RenderCell: ({ value }) => <Typography>{moment(value.date).format("DD MMM YYYY")}</Typography>,
  },
  {
    key: "nav",
    name: "Nav",
    width: 120,
  },
  {
    key: "units",
    name: "Units",
    width: 120,
  },
  {
    key: "amount",
    name: "Amount",
    rupee: true,
    width: 120,
  },
];

function TransactionModal(props: PropsType) {
  const { data } = props;
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!data) return;
    const tmpData = [];

    data.forEach((val: any, i: number) => {
      tmpData.push({
        key: `${i}-${val.folio}`,
        ...val,
      });
    });

    setTableData(tmpData);
  }, [data]);

  return <Table id="key" data={tableData} flexKey="folioNo" initialColumns={transactionInitialColums} />;
}

export default React.memo(TransactionModal);
