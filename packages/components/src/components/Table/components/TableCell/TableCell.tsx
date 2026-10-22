import type { FC, PropsWithChildren } from "react";
import { Suspense } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";
import { SkeletonText } from "@/components/SkeletonText";
import { SkeletonRawText } from "@/components/SkeletonMode/components/SkeletonRawText";

export interface TableCellProps
  extends
    Omit<Aria.CellProps, "children" | "style" | "render">,
    PropsWithChildren {
  /** Use cell as row header */
  rowHeader?: boolean;
  /** Horizontal alignment of the cell content @default "start" */
  horizontalAlign?: "start" | "center" | "end";
}

/** @flr-generate all */
export const TableCell: FC<TableCellProps> = (props) => {
  const {
    children,
    className,
    rowHeader,
    horizontalAlign = "start",
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.cell,
    rowHeader && styles.column,
    horizontalAlign !== "start" &&
      styles[`horizontal-align-${horizontalAlign}`],
    className,
  );

  return (
    <Aria.Cell className={rootClassName} {...rest}>
      <Suspense fallback={<SkeletonText width="100px" />}>
        <SkeletonRawText>{children}</SkeletonRawText>
      </Suspense>
    </Aria.Cell>
  );
};

export default TableCell;
