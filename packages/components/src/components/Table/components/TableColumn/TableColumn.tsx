import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";

export type TableColumnProps = Aria.ColumnProps;

export const TableColumn: FC<TableColumnProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.column, className);

  return (
    <Aria.Column isRowHeader className={rootClassName} {...rest}>
      {children}
    </Aria.Column>
  );
};

export default TableColumn;
