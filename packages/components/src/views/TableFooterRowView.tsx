/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TableFooterRowProps } from "@/components/Table";
import React, { useContext } from "react";
import { TableFooterRow } from "@/components/Table";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableFooterRowView: FC<TableFooterRowProps> = (props) => {
  const View =
    useContext(viewComponentContext)["TableFooterRow"] ?? TableFooterRow;
  return <View {...props} />;
};

export default TableFooterRowView;
