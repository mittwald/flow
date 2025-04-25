/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TableCellProps } from "@/components/Table";
import React, { useContext } from "react";
import { TableCell } from "@/components/Table";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableCellView: FC<TableCellProps> = (props) => {
  const View = useContext(viewComponentContext)["TableCell"] ?? TableCell;
  return <View {...props} />;
};

export default TableCellView;
