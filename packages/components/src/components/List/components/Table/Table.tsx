import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List";
import styles from "./Table.module.css";
import clsx from "clsx";
import { EmptyView } from "~/components/List/views/EmptyView/EmptyView";
import { TableLoadingMessage } from "~/components/List/views/Table";
import { useViewComponent } from "~/lib/viewComponentContext/useViewComponent";
import TableView, {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "~/components/Table";

export const Table: FC = () => {
  const list = useList();
  const table = list.table;
  const listIsEmpty = list.useIsEmpty();

  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();

  const Views = {
    Table: useViewComponent("Table", TableView),
    TableHeader: useViewComponent("TableHeader", TableHeader),
    TableColumn: useViewComponent("TableColumn", TableColumn),
    TableBody: useViewComponent("TableBody", TableBody),
    TableRow: useViewComponent("TableRow", TableRow),
    TableCell: useViewComponent("TableCell", TableCell),
  };

  if (!table) {
    return null;
  }

  if (isInitiallyLoading) {
    return <TableLoadingMessage {...table.componentProps} />;
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
    <Views.Table
      {...list.componentProps}
      {...table.componentProps}
      className={tableClassName}
    >
      <Views.TableHeader {...table.header.componentProps}>
        {table.header.columns.map((col, i) => (
          <Views.TableColumn key={i} {...col.componentProps} />
        ))}
      </Views.TableHeader>
      <Views.TableBody
        {...table.body.componentProps}
        renderEmptyState={() => <EmptyView />}
      >
        {list.items.entries.map((item) => (
          <Views.TableRow
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
              <Views.TableCell key={i} {...cell.componentProps}>
                {cell.renderFn ? cell.renderFn(item.data, list) : undefined}
              </Views.TableCell>
            ))}
          </Views.TableRow>
        ))}
      </Views.TableBody>
    </Views.Table>
  );
};
