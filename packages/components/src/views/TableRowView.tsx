/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { TableRow, type TableRowProps } from "@/components/Table";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableRowView: FC<TableRowProps> = (props) => {
  const View = useContext(viewComponentContext)["TableRow"] ?? TableRow;
  return <View {...props} />;
};

export default TableRowView;
