import React, { useMemo } from "react";

import Table, { ColumnsType } from "../../Table";

interface PropsType {
  data: any[];
}

const initialColumns: ColumnsType[] = [
  {
    name: "Scheme Name",
    key: "scheme_name",
    width: 120,
    sortable: false,
    maxWidth: 250,
  },
  {
    name: "Allocation",
    key: "allocation_perc",
    width: 100,
    sortable: false,
  },
  {
    name: "1 Year",
    key: "yrs1",
    width: 80,
    sortable: false,
  },
  {
    name: "3 Year",
    key: "yrs3",
    width: 80,
    sortable: false,
  },
  {
    name: "5 Year",
    key: "yrs5",
    width: 80,
    sortable: false,
  },
];

export default function BucketReturn(props: PropsType) {
  const { data } = props;

  const tableData = useMemo(() => {
    return data.map((val) => ({
      scheme_name: val.scheme_name,
      allocation_perc: val.allocation_perc,
      yrs1: val.returns.yrs1 || "-",
      yrs3: val.returns.yrs3 || "-",
      yrs5: val.returns.yrs5 || "-",
    }));
  }, [data]);

  return <Table id="scheme_name" data={tableData} flexKey="scheme_name" initialColumns={initialColumns} />;
}
