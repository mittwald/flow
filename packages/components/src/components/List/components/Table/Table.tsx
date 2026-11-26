import type { FC, ReactElement } from "react";
import { useRef } from "react";
import { isShallowEqual } from "remeda";
import { useList } from "@/components/List";
import styles from "./Table.module.scss";
import clsx from "clsx";
import TableView from "@/views/TableView";
import TableHeaderView from "@/views/TableHeaderView";
import TableBodyView from "@/views/TableBodyView";
import TableColumnView from "@/views/TableColumnView";
import { TableBodyLoadingView } from "@/components/List/components/Table/components/TableBodyLoadingView";
import { useInfiniteScrollTrigger } from "@/components/List/hooks/useInfiniteScrollTrigger";
import { useLatestOnAction } from "@/components/List/hooks/useLatestOnAction";
import { Row } from "@/components/List/components/Table/components/Row";
import type { Table as TableModel } from "@/components/List/model/table/Table";

interface LastRender {
  inputs: unknown[];
  table: TableModel<never>;
  element: ReactElement;
}

export const Table: FC = () => {
  const list = useList();
  const lastRender = useRef<LastRender | null>(null);
  const table = list.table;
  const listIsEmpty = list.useIsEmpty();

  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const isLoadingMore = list.loader.useIsLoadingMore();

  const { triggerRef, triggerIndex } = useInfiniteScrollTrigger();
  const onAction = useLatestOnAction(list);

  if (!table || listIsEmpty) {
    return null;
  }

  const tableClassName = clsx(
    styles.table,
    isLoading && !(list.infiniteScroll && isLoadingMore) && styles.isLoading,
    table.componentProps.className,
  );

  /*
   * react-aria re-renders every row and cell whenever its table renders, its
   * row memo or not (adobe/react-spectrum#10759). While nothing the table
   * shows has changed, it gets the element of the last render, so it does not
   * render at all.
   */
  const inputs = [
    tableClassName,
    isInitiallyLoading,
    isLoading,
    onAction,
    triggerIndex,
    triggerRef,
    ...list.items.entries.flatMap((item) => [item.id, item.data]),
  ];
  const last = lastRender.current;
  if (
    last &&
    isShallowEqual(last.inputs, inputs) &&
    table.rendersSameAs(last.table)
  ) {
    return last.element;
  }

  const rows = list.items.entries.map((item, index) => (
    <Row
      key={item.id}
      id={item.id}
      data={item.data}
      list={list}
      onAction={onAction}
      triggerRef={index === triggerIndex ? triggerRef : undefined}
    />
  ));

  const element = (
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
  lastRender.current = { inputs, table, element };
  return element;
};
