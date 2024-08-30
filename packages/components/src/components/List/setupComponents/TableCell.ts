import type { ComponentType } from "react";
import type {
  RenderCellFn,
  TableCellShape,
} from "@/components/List/model/table/types";

type Props<T> = Omit<TableCellShape<T>, "renderFn"> & {
  children: RenderCellFn<T>;
};

export const TableCell = <T>(ignoredProps: Props<T>) => null;

export const TypedTableCell = <T>() => TableCell as ComponentType<Props<T>>;
