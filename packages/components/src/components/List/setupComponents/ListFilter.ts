import type { FilterShape } from "~/components/List/model/filter/types";
import type { ReactNode } from "react";
import type {
  PropertyName,
  PropertyValue,
  PropertyValueRenderMethod,
} from "~/components/List/model/types";

type Props<T, TProp extends PropertyName<T>, TMatcherValue> = Omit<
  FilterShape<T, TProp, TMatcherValue>,
  "type" | "renderItem"
> & {
  children?: PropertyValueRenderMethod<TMatcherValue>;
};

export const ListFilter = <
  T,
  const TProp extends PropertyName<T> = PropertyName<T>,
  TMatcherValue = PropertyValue<T, TProp>,
>(
  ignoredProps: Props<T, TProp, TMatcherValue>,
) => null;

export const TypedListFilter = <T>() =>
  ListFilter as <
    const TProp extends PropertyName<T>,
    TMatcherValue = PropertyValue<T, TProp>,
  >(
    props: Props<T, TProp, TMatcherValue>,
  ) => ReactNode;
