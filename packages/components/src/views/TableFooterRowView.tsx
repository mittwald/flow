/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  TableFooterRow,
  type TableFooterRowProps,
} from "@/components/Table/components/TableFooterRow/TableFooterRow";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableFooterRowView: FC<TableFooterRowProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["TableFooterRow"] ?? TableFooterRow;
  return <View {...props} />;
});
TableFooterRowView.displayName = "TableFooterRowView";

export default TableFooterRowView;
