import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Table.module.scss";
import { useLabelledBySectionHeading } from "@/components/Section/context";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export type TableProps = Omit<
  Aria.TableProps,
  "render" | "className" | "style"
> & {
  /** The vertical alignment of the table cells content. */
  verticalAlign?: "top" | "middle";
  /**
   * The column-sizing algorithm of the table. Use "fixed" together with column
   * widths to enforce exact widths. @default "auto"
   */
  layout?: "auto" | "fixed";
  /**
   * The minimum width of the table. Below this width the table scrolls
   * horizontally instead of shrinking its columns.
   */
  minWidth?: number | string;
  /** The elements class name. */
  className?: string;
} & FlowComponentProps;

/** @flr-generate all */
export const Table = flowComponent("Table", (props) => {
  const {
    children,
    className,
    verticalAlign = "top",
    layout = "auto",
    minWidth,
    ref,
    ...rest
  } = props;

  const ariaLabelledBy = useLabelledBySectionHeading(rest);

  const rootClassName = clsx(
    styles.table,
    verticalAlign !== "top" && styles[`vertical-align-${verticalAlign}`],
    styles[`layout-${layout}`],
    className,
  );

  return (
    <div className={styles.tableContainer} ref={ref}>
      <div className={styles.tableScrollArea} style={{ minWidth }}>
        <Aria.Table
          className={rootClassName}
          {...rest}
          aria-labelledby={ariaLabelledBy}
        >
          {children}
        </Aria.Table>
      </div>
    </div>
  );
});

export default Table;
