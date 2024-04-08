import type { SortingShape } from "@/components/List/model/sorting/types";

interface Props<T> extends SortingShape<T> {
  defaultEnabled?: boolean;
}

export function ListSorting<T = never>(ignoredProps: Props<T>) {
  return null;
}
