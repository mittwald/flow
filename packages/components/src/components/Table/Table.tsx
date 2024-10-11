import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Table.module.scss";

export type TableProps = Aria.TableProps & {
  verticalAlign?: "top" | "middle";
};
export const Table: FC<TableProps> = (props) => {
  const { children, className, verticalAlign = "top", ...rest } = props;

  const rootClassName = clsx(
    styles.table,
    styles[`vertical-align-${verticalAlign}`],
    className,
  );

  return (
    <div className={styles.tableContainer}>
      <Aria.Table className={rootClassName} {...rest}>
        {children}
      </Aria.Table>
    </div>
  );
};

export default Table;
