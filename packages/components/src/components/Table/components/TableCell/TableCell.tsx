import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";

export interface TableCellProps extends Aria.CellProps {}

export const TableCell: FC<TableCellProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.cell, className);

  return (
    <Aria.Cell className={rootClassName} {...rest}>
      {children}
    </Aria.Cell>
  );
};

export default TableCell;
