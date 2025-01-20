/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { TableFooterRow, type TableFooterRowProps } from "~/components/Table";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const TableFooterRowView: FC<TableFooterRowProps> = (props) => {
  const View =
    useContext(viewComponentContext)["TableFooterRow"] ?? TableFooterRow;
  return <View {...props} />;
};

export default TableFooterRowView;
