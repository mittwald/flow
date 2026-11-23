import type { FC } from "react";
import type { TableRowProps } from "../TableRow";
import { TableRow } from "../TableRow";

export type TableFooterRowProps = TableRowProps;

/* Plain FC: technical constraint — react-aria allows render-function children,
 * which the props types of registered components cannot express. */
/** @flr-generate all */
export const TableFooterRow: FC<TableRowProps> = (props) => {
  return <TableRow {...props} footer={true} />;
};

export default TableFooterRow;
