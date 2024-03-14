import { SortingShape } from "@/components/List/model/sorting/types";

interface Props<T> extends SortingShape<T> {}

export function ListSorting<T = never>(ignoredProps: Props<T>) {
  return null;
}
