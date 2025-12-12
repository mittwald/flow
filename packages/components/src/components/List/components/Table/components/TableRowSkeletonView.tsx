import { useList } from "@/components/List/hooks/useList";
import TableRowView from "@/views/TableRowView";
import clsx from "clsx";
import type { FC } from "react";
import styles from "../Table.module.css";
import invariant from "invariant";
import TableCellView from "@/views/TableCellView";
import SkeletonTextView from "@/views/SkeletonTextView";

export const TableRowSkeletonView: FC = () => {
  const list = useList();
  const table = list.table;

  invariant(
    !!table,
    "TableRowSkeletonView must be used within a Table component",
  );

  const className = clsx(styles.row, table.body.row.componentProps.className);

  return (
    <TableRowView {...table.body.row.componentProps} className={className}>
      {table.body.row?.cells.map((cell, i) => (
        <TableCellView key={i} {...cell.componentProps}>
          {cell.loadingView ?? <SkeletonTextView width="10em" />}
        </TableCellView>
      ))}
    </TableRowView>
  );
};
