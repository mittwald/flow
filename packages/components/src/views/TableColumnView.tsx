/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TableColumnProps } from "@/components/Table";
import React, { useContext } from "react";
import { TableColumn } from "@/components/Table";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableColumnView: FC<TableColumnProps> = (props) => {
  const View = useContext(viewComponentContext)["TableColumn"] ?? TableColumn;
  return <View {...props} />;
};

export default TableColumnView;
