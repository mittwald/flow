import type { FC } from "react";
import React from "react";
import type { TableRowProps } from "../TableRow";
import { TableRow } from "../TableRow";

export const TableFooterRow: FC<TableRowProps> = (props) => {
  return <TableRow {...props} footer={true} />;
};

export default TableFooterRow;
