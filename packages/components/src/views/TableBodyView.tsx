/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  TableBody,
  type TableBodyProps,
} from "@/components/Table/components/TableBody/TableBody";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableBodyView: FC<TableBodyProps> = memo((props) => {
  const View = useContext(viewComponentContext)["TableBody"] ?? TableBody;
  return <View {...props} />;
});
TableBodyView.displayName = "TableBodyView";

export default TableBodyView;
