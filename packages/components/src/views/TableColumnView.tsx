/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { TableColumn, type TableColumnProps } from "~/components/Table";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const TableColumnView: FC<TableColumnProps> = (props) => {
  const View = useContext(viewComponentContext)["TableColumn"] ?? TableColumn;
  return <View {...props} />;
};

export default TableColumnView;
