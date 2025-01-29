/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { TableCell, type TableCellProps } from "@/components/Table";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableCellView: FC<TableCellProps> = (props) => {
  const View = useContext(viewComponentContext)["TableCell"] ?? TableCell;
  return <View {...props} />;
};

export default TableCellView;
