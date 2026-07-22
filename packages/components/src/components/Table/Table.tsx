import type { FC } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Table.module.scss";

export type TableProps = Omit<Aria.TableProps, "render" | "className"> & {
  /** The vertical alignment of the table cells content. */
  verticalAlign?: "top" | "middle";
  /**
   * The column-sizing algorithm of the table. Use "fixed" together with column
   * widths to enforce exact widths. @default "auto"
   */
  layout?: "auto" | "fixed";
  className?: string;
};

/** @flr-generate all */
export const Table: FC<TableProps> = (props) => {
  const {
    children,
    className,
    verticalAlign = "top",
    layout = "auto",
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.table,
    styles[`vertical-align-${verticalAlign}`],
    styles[`layout-${layout}`],
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
