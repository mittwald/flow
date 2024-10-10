import React from "react";
import type { TableRowProps } from "../TableRow";
import { TableRow } from "../TableRow";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface TableFooterRowProps
  extends FlowComponentProps,
    TableRowProps {}

export const TableFooterRow = flowComponent("TableFooterRow", (props) => {
  return <TableRow {...props} footer={true} />;
});

export default TableFooterRow;
