/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TableProps } from "@/components/Table";
import React, { useContext } from "react";
import { Table } from "@/components/Table";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableView: FC<TableProps> = (props) => {
  const View = useContext(viewComponentContext)["Table"] ?? Table;
  return <View {...props} />;
};

export default TableView;
