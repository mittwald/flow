import type { ComponentType } from "react";
import type { TableColumnShape } from "~/components/List/model/table/types";

type Props<IgnoredT> = TableColumnShape;

export const TableColumn = <T>(ignoredProps: Props<T>) => null;

export const TypedTableColumn = <T>() => TableColumn as ComponentType<Props<T>>;
