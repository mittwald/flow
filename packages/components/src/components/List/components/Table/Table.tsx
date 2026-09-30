import type { FC } from "react";
import { useList } from "@/components/List";
import styles from "./Table.module.scss";
import clsx from "clsx";
import TableView from "@/views/TableView";
import TableHeaderView from "@/views/TableHeaderView";
import TableBodyView from "@/views/TableBodyView";
import TableRowView from "@/views/TableRowView";
import TableCellView from "@/views/TableCellView";
import TableColumnView from "@/views/TableColumnView";
import { TableBodyLoadingView } from "@/components/List/components/Table/components/TableBodyLoadingView";
import { useInfiniteScrollTrigger } from "@/components/List/hooks/useInfiniteScrollTrigger";

export const Table: FC = () => {
  const list = useList();
  const table = list.table;
  const listIsEmpty = list.useIsEmpty();

  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const isLoadingMore = list.loader.useIsLoadingMore();

  const { triggerRef, triggerIndex } = useInfiniteScrollTrigger();

  if (!table || listIsEmpty) {
    return null;
  }

  const rowAction = table.list.onAction;

  const tableClassName = clsx(
    styles.table,
    isLoading && !(list.infiniteScroll && isLoadingMore) && styles.isLoading,
    table.componentProps.className,
  );

  const rows = list.items.entries.map((item, index) => (
    <TableRowView
      className={clsx(
        styles.row,
        rowAction && styles.hasAction,
        table.body.row.componentProps.className,
      )}
      key={item.id}
      id={item.id}
      onAction={rowAction ? () => rowAction(item.data) : undefined}
      {...table.body.row.componentProps}
      {...(index === triggerIndex ? { ref: triggerRef } : {})}
    >
      {table.body.row?.cells.map((cell, i) => (
        <TableCellView key={i} {...cell.componentProps}>
          {cell.renderFn ? cell.renderFn(item.data, list) : undefined}
        </TableCellView>
      ))}
    </TableRowView>
  ));

  return (
    <TableView
      {...list.componentProps}
      {...table.componentProps}
      className={tableClassName}
      aria-hidden={isInitiallyLoading}
      aria-busy={isLoading}
    >
      <TableHeaderView {...table.header.componentProps}>
        {table.header.columns.map((col, i) => (
          <TableColumnView key={i} {...col.componentProps} />
        ))}
      </TableHeaderView>
      <TableBodyView {...table.body.componentProps}>
        {isInitiallyLoading ? <TableBodyLoadingView /> : rows}
      </TableBodyView>
    </TableView>
  );
};
