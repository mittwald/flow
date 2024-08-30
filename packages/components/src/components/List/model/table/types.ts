import type { PropsWithChildren, ReactNode } from "react";
import type {
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableHeaderProps,
  TableProps,
  TableRowProps,
} from "@/components/Table";
import type { ItemActionFn } from "@/components/List/model/types";

/** Cell */
export type RenderCellFn<T> = (data: T) => ReactNode;
export type TableCellSupportedComponentProps = Omit<TableCellProps, "children">;
export interface TableCellShape<T> extends TableCellSupportedComponentProps {
  renderFn?: RenderCellFn<T>;
}

/** Row */
export type TableRowSupportedComponentProps = Omit<
  TableRowProps,
  "onAction" | "children"
>;
export interface TableRowShape<T>
  extends TableRowSupportedComponentProps,
    PropsWithChildren {
  cells?: TableCellShape<T>[];
  onAction?: ItemActionFn<T>;
}

/** Column */
export type TableColumnSupportedComponentProps = TableColumnProps;
export type TableColumnShape = TableColumnSupportedComponentProps;

/** Header */
export type TableHeaderSupportedComponentProps = Omit<
  TableHeaderProps,
  "columns"
>;
export interface TableHeaderShape extends TableHeaderSupportedComponentProps {
  columns?: TableColumnShape[];
}

/** Body */
export type TableBodySupportedComponentProps = TableBodyProps;
export interface TableBodyShape<T> extends TableBodySupportedComponentProps {
  row?: TableRowShape<T>;
}

/** Table */
export type TableSupportedComponentProps = TableProps;
export interface TableShape<T> extends TableSupportedComponentProps {
  header?: TableHeaderShape;
  body?: TableBodyShape<T>;
}
