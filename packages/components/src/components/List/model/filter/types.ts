import type {
  PropertyName,
  PropertyValue,
  PropertyValueRenderMethod,
} from "@/components/List/model/types";
import type { ItemType } from "@/lib/types/array";

export type FilterMode = "all" | "some" | "one";

export type FilterMatcher<T, P, TMatcherValue> = (
  filterBy: NonNullable<ItemType<TMatcherValue>>,
  filterFrom: PropertyValue<T, P>,
) => boolean;

export interface FilterShape<T, TProp extends PropertyName<T>, TMatcherValue> {
  property: TProp;
  renderItem?: PropertyValueRenderMethod<TMatcherValue>;
  mode?: FilterMode;
  matcher?: FilterMatcher<T, TProp, TMatcherValue>;
  values?: readonly TMatcherValue[];
  name?: string;
  defaultSelected?: readonly NonNullable<TMatcherValue>[];
  /**
   * If provided, the filter will be initialized with these values instead of
   * the defaultSelected and restored selections from any provided settings
   * storage. It behaves like an initial user initiated selection.
   */
  initialSelected?: readonly NonNullable<TMatcherValue>[];
  onChanged?: FilterUpdatedCallback<T, TProp>;
  priority?: "primary" | "secondary";
  autosave?: boolean;
}

export type FilterUpdatedCallback<T, TProp extends PropertyName<T>> = (
  filter: { property: TProp },
  values: unknown[],
) => unknown;
