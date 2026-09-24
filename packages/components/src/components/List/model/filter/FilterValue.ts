import { ListFilterValue } from "@mittwald/flow-components-base";
import type { ReactNode } from "react";

/**
 * Framework-free apart from what it renders to, which the core takes as a type
 * parameter — so React's is that class with `ReactNode` filled in.
 */
export type FilterValue = ListFilterValue<ReactNode>;
export const FilterValue = ListFilterValue;
