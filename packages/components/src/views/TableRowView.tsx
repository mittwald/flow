/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  TableRow,
  type TableRowProps,
} from "@/components/Table/components/TableRow/TableRow";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableRowView: FC<TableRowProps> = memo((props) => {
  const View = useContext(viewComponentContext)["TableRow"] ?? TableRow;
  return <View {...props} />;
});
TableRowView.displayName = "TableRowView";

export default TableRowView;
