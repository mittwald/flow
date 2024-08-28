import type { DeepKeys, DeepValue } from "@tanstack/react-table";
import type { SortingShape } from "@/components/List/model/sorting/types";
import type { BatchesControllerShape } from "@/components/List/model/pagination/types";
import type { FilterShape } from "@/components/List/model/filter/types";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";
import type { SearchShape } from "@/components/List/model/search/types";
import type { ItemViewShape } from "@/components/List/model/item/ItemView";
import type { ReactNode } from "react";
import type { ItemType } from "@/lib/types/array";
import type List from "@/components/List/model/List";

export const customPropertyPrefix = "$" as const;
export type CustomPropertyName = `${typeof customPropertyPrefix}${string}`;

export type PropertyName<T> = DeepKeys<T> | CustomPropertyName;
export type PropertyValue<T, TProp> = TProp extends CustomPropertyName
  ? T
  : DeepValue<T, TProp>;
export type PropertyValueRenderMethod<TMatcherValue> = (
  prop: NonNullable<ItemType<TMatcherValue>>,
) => ReactNode;

export type OnListChanged<T> = (list: List<T>) => void;

export interface ListShape<T> {
  loader?: IncrementalLoaderShape<T>;
  filters?: FilterShape<T, never, never>[];
  itemView?: ItemViewShape<T>;
  search?: SearchShape<T>;
  sorting?: SortingShape<T>[];
  batchesController?: BatchesControllerShape;
  hasAction?: boolean;
  onChange?: OnListChanged<T>;
}

export type PropertyRecord<T, TValue> = Partial<
  Record<PropertyName<T>, TValue>
>;
