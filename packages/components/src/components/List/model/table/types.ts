import type { DependencyList, PropsWithChildren, ReactElement } from "react";
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
  "onAction" | "children" | "footer" | "className" | "render"
> & {
  className?: string;
};

export interface TableRowShape<T>
  extends TableRowSupportedComponentProps, PropsWithChildren {
  cells?: TableCellShape<T>[];
  /**
   * Everything the cells' render functions read besides the row's data.
   *
   * With `renderDependencies`, a row re-renders only when its data, one of
   * these values, or a cell's props change. The render functions' identity does
   * not count, so functions written inline in JSX keep the row from
   * re-rendering on every render of its parent. List every value they read from
   * outside the row, including state read through the `list` argument — one
   * left out keeps the row on the value it last rendered.
   *
   * Row and cell props count by identity, so an inline `style` object or
   * callback on `List.TableRow` or `List.TableCell` re-renders every row.
   *
   * Without it, every row re-renders whenever the list does.
   */
  renderDependencies?: DependencyList;
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
