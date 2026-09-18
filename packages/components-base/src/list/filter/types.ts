import type { ItemType } from "../../lib/array";
import type {
  PropertyName,
  PropertyValue,
  PropertyValueRenderMethod,
} from "../types";

export type FilterMode = "all" | "some" | "one" | "dateRange";

export type FilterMatcher<T, P, TMatcherValue> = (
  filterBy: NonNullable<ItemType<TMatcherValue>>,
  filterFrom: PropertyValue<T, P>,
) => boolean;

export type FilterUpdatedCallback = (values: unknown[]) => unknown;

export interface ListFilterShape<
  T,
  TProp extends PropertyName<T>,
  TMatcherValue,
  TRendered = unknown,
> {
  property: TProp;
  renderItem?: PropertyValueRenderMethod<TMatcherValue, TRendered>;
  mode?: FilterMode;
  matcher?: FilterMatcher<T, TProp, TMatcherValue>;
  values?: readonly TMatcherValue[];
  name?: string;
  defaultSelected?: readonly NonNullable<TMatcherValue>[];
  onChange?: FilterUpdatedCallback;
  priority?: "primary" | "secondary";
  autosave?: boolean;
  manualSave?: boolean;
}
