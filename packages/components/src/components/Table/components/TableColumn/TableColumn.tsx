import type { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface TableColumnProps
  extends
    Omit<
      Aria.ColumnProps,
      "children" | "width" | "minWidth" | "maxWidth" | "style"
    >,
    PropsWithChildren {
  /** Horizontal alignment of the cell content @default "start" */
  horizontalAlign?: "start" | "center" | "end";
  /** The width of the column. */
  width?: number | string;
  /** The minimum width of the column. */
  minWidth?: number | string;
}

/** @flr-generate all */
export const TableColumn: FC<TableColumnProps> = (props) => {
  const {
    children,
    className,
    horizontalAlign = "start",
    width,
    minWidth,
    ...rest
  } = props;
  const rootClassName = clsx(
    styles.column,
    styles[`horizontal-align-${horizontalAlign}`],
    className,
  );

  const propsContext: PropsContext = { Checkbox: { slot: null } };

  return (
    <Aria.Column
      isRowHeader
      className={rootClassName}
      {...rest}
      style={{ width, minWidth }}
    >
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Aria.Column>
  );
};

export default TableColumn;
