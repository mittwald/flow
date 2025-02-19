/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { TableHeader, type TableHeaderProps } from "@/components/Table";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableHeaderView: FC<TableHeaderProps> = (props) => {
  const View = useContext(viewComponentContext)["TableHeader"] ?? TableHeader;
  return <View {...props} />;
};

export default TableHeaderView;
