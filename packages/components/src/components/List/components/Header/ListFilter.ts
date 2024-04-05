import type { FilterShape } from "@/components/List/model/filter/types";

interface Props<T> extends Omit<FilterShape<T>, "type"> {}

export function ListFilter<T = never>(ignoredProps: Props<T>) {
  return null;
}
