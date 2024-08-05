import type { DeepKeys, DeepValue } from "@tanstack/react-table";
import type { SortingShape } from "@/components/List/model/sorting/types";
import type { BatchesControllerShape } from "@/components/List/model/pagination/types";
import type { FilterShape } from "@/components/List/model/filter/types";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";
import type { SearchShape } from "@/components/List/model/search/types";
import type { ItemViewShape } from "@/components/List/model/item/ItemView";
import type { ReactNode } from "react";

export type PropertyName<T> = DeepKeys<T>;
export type PropertyValue<T, TProp> = DeepValue<T, TProp>;
export type PropertyValueRenderMethod<T, P> = (
  prop: PropertyValue<T, P>,
) => ReactNode;

export interface ListShape<T> {
  loader?: IncrementalLoaderShape<T>;
  filters?: FilterShape<T, never, never>[];
  itemView?: ItemViewShape<T>;
  search?: SearchShape<T>;
  sorting?: SortingShape<T>[];
  batchesController?: BatchesControllerShape;
  hasAction: boolean;
}

export type PropertyRecord<T, TValue> = Partial<
  Record<PropertyName<T>, TValue>
>;
