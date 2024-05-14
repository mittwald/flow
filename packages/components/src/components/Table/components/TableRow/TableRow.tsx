import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";

export interface TableRowProps extends Aria.RowProps<never> {}

export const TableRow: FC<TableRowProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.row, className);

  return (
    <Aria.Row className={rootClassName} {...rest}>
      {children}
    </Aria.Row>
  );
};

export default TableRow;
