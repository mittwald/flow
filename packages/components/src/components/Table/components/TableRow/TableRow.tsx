import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";

export type TableRowProps = Aria.RowProps<never>;

export const TableRow: FC<TableRowProps> = (props) => {
  const { children, className, ...rest } = props;

  return (
    <Aria.Row
      className={(props) =>
        clsx(
          styles.row,
          typeof className === "function" ? className(props) : className,
        )
      }
      {...rest}
    >
      {children}
    </Aria.Row>
  );
};

export default TableRow;
