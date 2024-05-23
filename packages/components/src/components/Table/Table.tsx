import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Table.module.scss";

export interface TableProps extends Aria.TableProps {}

export const Table: FC<TableProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.table, className);

  return (
    <div className={styles.tableContainer}>
      <Aria.Table className={rootClassName} {...rest}>
        {children}
      </Aria.Table>
    </div>
  );
};

export default Table;
