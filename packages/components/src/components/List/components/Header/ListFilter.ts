import type { FilterShape } from "@/components/List/model/filter/types";

type Props<T> = Omit<FilterShape<T>, "type">;

export function ListFilter<T = never>(ignoredProps: Props<T>) {
  return null;
}
