import type { ComponentType } from "react";
import type { TableBodyShape } from "~/components/List/model/table/types";

type Props<IgnoredT> = TableBodyShape<IgnoredT>;

export const TableBody = <T>(ignoredProps: Props<T>) => null;

export const TypedTableBody = <T>() => TableBody as ComponentType<Props<T>>;
