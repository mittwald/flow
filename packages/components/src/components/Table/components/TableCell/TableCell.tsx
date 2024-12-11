import type { FC, PropsWithChildren } from "react";
import React, { Suspense } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";
import { SkeletonText } from "@/components/SkeletonText";

export interface TableCellProps
  extends Omit<Aria.CellProps, "children">,
    PropsWithChildren {
  rowHeader?: boolean;
}

export const TableCell: FC<TableCellProps> = (props) => {
  const { children, className, rowHeader, ...rest } = props;

  const rootClassName = clsx(
    styles.cell,
    rowHeader && styles.rowHeader,
    className,
  );

  return (
    <Aria.Cell className={rootClassName} {...rest}>
      <Suspense fallback={<SkeletonText width="100px" />}>{children}</Suspense>
    </Aria.Cell>
  );
};

export default TableCell;
