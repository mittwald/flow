import type { Filter } from "@/components/List/model/filter/Filter";
import { ListFilterValue } from "@mittwald/flow-components-base";
import type { ReactNode } from "react";

/**
 * Framework-free apart from what it renders to, which the core takes as a type
 * parameter — so React's is that class with `ReactNode` filled in, and its
 * filter typed as React's, the one that carries `list`.
 */
export type FilterValue = ListFilterValue<ReactNode> & {
  readonly filter: Filter<unknown, string, unknown>;
};
export const FilterValue = ListFilterValue;
