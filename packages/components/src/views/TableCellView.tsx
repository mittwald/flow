/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { TableCell, type TableCellProps } from "@/components/Table";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableCellView: FC<TableCellProps> = memo((props) => {
  const View = useContext(viewComponentContext)["TableCell"] ?? TableCell;
  return <View {...props} />;
});
TableCellView.displayName = "TableCellView";

export default TableCellView;
