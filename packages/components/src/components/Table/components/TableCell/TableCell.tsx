import type { FC, PropsWithChildren } from "react";
import React, { Suspense } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";
import { SkeletonText } from "@/components/SkeletonText";
import { TableColumn } from "@/components/Table";

export interface TableCellProps
  extends Omit<Aria.CellProps, "children" | "style">,
    PropsWithChildren {
  rowHeader?: boolean;
  /** @default "start" */
  horizontalAlign?: "start" | "center";
}

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
    styles[`horizontal-align-${horizontalAlign}`],
    className,
  );

  const content = (
    <Suspense fallback={<SkeletonText width="100px" />}>{children}</Suspense>
  );

  if (rowHeader) {
    return (
      <TableColumn className={rootClassName} {...rest}>
        {content}
      </TableColumn>
    );
  }

  return (
    <Aria.Cell className={rootClassName} {...rest}>
      {content}
    </Aria.Cell>
  );
};

export default TableCell;
