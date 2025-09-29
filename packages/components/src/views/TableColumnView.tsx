/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  TableColumn,
  type TableColumnProps,
} from "@/components/Table/components/TableColumn/TableColumn";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableColumnView: FC<TableColumnProps> = memo((props) => {
  const View = useContext(viewComponentContext)["TableColumn"] ?? TableColumn;
  return <View {...props} />;
});
TableColumnView.displayName = "TableColumnView";

export default TableColumnView;
