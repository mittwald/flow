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
import { EmptyView } from "~/components/List/components/EmptyView/EmptyView";

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
    return <EmptyView />;
  }

  const rowAction = table.list.onAction;

  const tableClassName = clsx(
    styles.table,
    isLoading && styles.isLoading,
    table.componentProps.className,
  );

  return (
    <TableComponent
      {...list.componentProps}
      {...table.componentProps}
      className={tableClassName}
    >
      <TableHeader {...table.header.componentProps}>
        {table.header.columns.map((col, i) => (
          <TableColumn key={i} {...col.componentProps} />
        ))}
      </TableHeader>
      <TableBody
        {...table.body.componentProps}
        renderEmptyState={() => <EmptyView />}
      >
        {list.items.entries.map((item) => (
          <TableRow
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
              <TableCell key={i} {...cell.componentProps}>
                {cell.renderFn ? cell.renderFn(item.data, list) : undefined}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </TableComponent>
  );
};
