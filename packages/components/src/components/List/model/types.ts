import type { DeepKeys, DeepValue } from "@tanstack/react-table";
import type { SortingShape } from "@/components/List/model/sorting/types";
import type { BatchesControllerShape } from "@/components/List/model/pagination/types";
import type { FilterShape } from "@/components/List/model/filter/types";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";
import type { RenderItemFn } from "@/components/List/model/item/types";

export type PropertyName<T> = never extends T ? string : DeepKeys<T>;
export type PropertyValue<T, TProp> = DeepValue<T, TProp>;

export interface ListShape<T> {
  loader?: IncrementalLoaderShape<T>;
  render?: RenderItemFn<T>;
  filters?: FilterShape<T, never, never>[];
  sorting?: SortingShape<T>[];
  batchesController?: BatchesControllerShape;
}

export type PropertyRecord<T, TValue> = Partial<
  Record<PropertyName<T>, TValue>
>;
