import type { PropsWithChildren, ReactElement } from "react";
import type {
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableHeaderProps,
  TableProps,
  TableRowProps,
} from "@/components/Table";
import type { RenderItemFn } from "@/components/List";

/** Cell */
export type TableCellSupportedComponentProps = Omit<TableCellProps, "children">;
export interface TableCellShape<T> extends TableCellSupportedComponentProps {
  renderFn?: RenderItemFn<T>;
  loadingView?: ReactElement;
}

/** Row */
export type TableRowSupportedComponentProps = Omit<
  TableRowProps,
  "onAction" | "children" | "footer"
>;
export interface TableRowShape<T>
  extends TableRowSupportedComponentProps, PropsWithChildren {
  cells?: TableCellShape<T>[];
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
