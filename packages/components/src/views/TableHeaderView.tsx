/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { TableHeader, type TableHeaderProps } from "@/components/Table";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableHeaderView: FC<TableHeaderProps> = memo((props) => {
  const View = useContext(viewComponentContext)["TableHeader"] ?? TableHeader;
  return <View {...props} />;
});
TableHeaderView.displayName = "TableHeaderView";

export default TableHeaderView;
