import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List";
import { TableLoadingView } from "@/components/List/components/Table/components/TableLoadingView";
import styles from "./Table.module.css";
import clsx from "clsx";
import ListEmptyViewView from "@/views/ListEmptyViewView";
import TableView from "@/views/TableView";
import TableHeaderView from "@/views/TableHeaderView";
import TableBodyView from "@/views/TableBodyView";
import TableRowView from "@/views/TableRowView";
import TableCellView from "@/views/TableCellView";
import TableColumnView from "@/views/TableColumnView";

export const Table: FC = () => {
  const list = useList();
  const table = list.table;
  const listIsEmpty = list.useIsEmpty();

  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();

  if (!table) {
    return null;
  }

  if (isInitiallyLoading) {
    return <TableLoadingView {...table.componentProps} />;
  }

  if (listIsEmpty) {
    return <ListEmptyViewView />;
  }

  const rowAction = table.list.onAction;

  const tableClassName = clsx(
    styles.table,
    isLoading && styles.isLoading,
    table.componentProps.className,
  );

  return (
    <TableView
      {...list.componentProps}
      {...table.componentProps}
      className={tableClassName}
    >
      <TableHeaderView {...table.header.componentProps}>
        {table.header.columns.map((col, i) => (
          <TableColumnView key={i} {...col.componentProps} />
        ))}
      </TableHeaderView>
      <TableBodyView {...table.body.componentProps}>
        {list.items.entries.map((item) => (
          <TableRowView
            className={(props) =>
              clsx(
                styles.row,
                rowAction && styles.hasAction,
                table.body.row.componentProps.className,
                props.isSelected && styles.isSelected,
              )
            }
            key={item.id}
            id={item.id}
            onAction={rowAction ? () => rowAction(item.data) : undefined}
            {...table.body.row.componentProps}
          >
            {table.body.row?.cells.map((cell, i) => (
              <TableCellView key={i} {...cell.componentProps}>
                {cell.renderFn ? cell.renderFn(item.data, list) : undefined}
              </TableCellView>
            ))}
          </TableRowView>
        ))}
      </TableBodyView>
    </TableView>
  );
};
