import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface TableColumnProps
  extends Omit<Aria.ColumnProps, "children">, PropsWithChildren {
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

  const propsContext: PropsContext = { Checkbox: { slot: null } };

  return (
    <Aria.Column isRowHeader className={rootClassName} {...rest}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Aria.Column>
  );
};

export default TableColumn;
