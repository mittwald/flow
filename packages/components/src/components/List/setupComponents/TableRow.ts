import type { ComponentType } from "react";
import type { TableRowShape } from "~/components/List/model/table/types";

type Props<T> = Omit<TableRowShape<T>, "cells">;

export const TableRow = <T>(ignoredProps: Props<T>) => null;

export const TypedTableRow = <T>() => TableRow as ComponentType<Props<T>>;
