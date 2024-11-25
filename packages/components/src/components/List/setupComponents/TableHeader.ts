import type { ComponentType } from "react";
import type { TableHeaderShape } from "@/components/List/model/table/types";

type Props<IgnoredT> = TableHeaderShape;

export const TableHeader = <T>(ignoredProps: Props<T>) => null;

export const TypedTableHeader = <T>() => TableHeader as ComponentType<Props<T>>;
