import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "~/components/Table";
import { TableLoadingView } from "~/components/List/components/Table/components/TableLoadingView";
import styles from "./Table.module.css";
import clsx from "clsx";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";
import { EmptyView } from "~/components/List/views/EmptyView";
import { SkeletonText } from "~/components/SkeletonText";

export const Table: FC = () => {
  const {
    TableView,
    TableBodyView,
    TableCellView,
    TableHeaderView,
    TableRowView,
    TableColumnView,
    ListEmptyViewView,
  } = useViewComponents(
    ["Table", TableComponent],
    ["TableHeader", TableHeader],
    ["SkeletonText", SkeletonText],
    ["TableBody", TableBody],
    ["TableRow", TableRow],
    ["TableCell", TableCell],
    ["TableColumn", TableColumn],
    ["ListEmptyView", EmptyView],
  );

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
