import type { SortingShape } from "@/components/List/model/sorting/types";
import type { ComponentType } from "react";

type Props<T> = SortingShape<T>;

export const ListSorting = <T>(ignoredProps: Props<T>) => null;

export const TypedListSorting = <T>() => ListSorting as ComponentType<Props<T>>;
