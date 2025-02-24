import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";

export interface TableColumnProps extends Aria.ColumnProps {
  /** Horizontal alignment of the cell content @default "start" */
  horizontalAlign?: "start" | "center" | "end";
}

/** @flr-generate all */
export const TableColumn: FC<TableColumnProps> = (props) => {
  const { children, className, horizontalAlign = "start", ...rest } = props;
  const rootClassName = clsx(
    styles.column,
    styles[`horizontal-align-${horizontalAlign}`],
    className,
  );

  return (
    <Aria.Column isRowHeader className={rootClassName} {...rest}>
      {children}
    </Aria.Column>
  );
};

export default TableColumn;
