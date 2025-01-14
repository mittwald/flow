import type { ComponentType } from "react";
import type { TableCellShape } from "~/components/List/model/table/types";
import type { RenderItemFn } from "~/components/List";

type Props<T> = Omit<TableCellShape<T>, "renderFn"> & {
  children: RenderItemFn<T>;
};

export const TableCell = <T>(ignoredProps: Props<T>) => null;

export const TypedTableCell = <T>() => TableCell as ComponentType<Props<T>>;
