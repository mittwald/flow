import type { ComponentType } from "react";
import type { TableShape } from "~/components/List/model/table/types";

type Props<T> = Omit<TableShape<T>, "header" | "body">;

export const Table = <T>(ignoredProps: Props<T>) => null;

export const TypedTable = <T>() => Table as ComponentType<Props<T>>;
