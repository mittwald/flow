import type { FilterShape } from "@/components/List/model/filter/types";
import type { PropertyName } from "@/components/List/model/types";
import type { ListModelContext } from "@mittwald/flow-components-base";
import { ListFilter } from "@mittwald/flow-components-base";
import type { ReactNode } from "react";

/**
 * React's filter: the shared one, with `renderItem` narrowed.
 *
 * Everything a filter does — values, selection, persistence, the predicate the
 * table runs — is `ListFilter` in `@mittwald/flow-components-base`. The one
 * thing that is not shareable is what a filter value _looks_ like, so the core
 * carries the rendered type as a parameter and this fills it with `ReactNode`.
 */
export class Filter<
  T = never,
  TProp extends PropertyName<T> = never,
  TMatchValue = never,
> extends ListFilter<T, TProp, TMatchValue, ReactNode> {
  public constructor(
    context: ListModelContext<T>,
    shape: FilterShape<T, TProp, TMatchValue>,
  ) {
    super(context, shape);
  }
}

export default Filter;
