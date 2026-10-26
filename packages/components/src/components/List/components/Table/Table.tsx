import type { FC } from "react";
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

export const Table: FC = () => {
  const list = useList();
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
