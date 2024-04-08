import type {
  PropertyName,
  RenderItemFn,
} from "@/components/List/model/item/Item";
import type { SortingShape } from "@/components/List/model/sorting/types";
import type { BatchesControllerShape } from "@/components/List/model/pagination/types";
import type { FilterShape } from "@/components/List/model/filter/types";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";

export interface ListShape<T> {
  loader?: IncrementalLoaderShape<T>;
  render?: RenderItemFn<T>;
  filters?: FilterShape<T>[];
  sorting?: SortingShape<T>[];
  batchesController?: BatchesControllerShape;
}

export type PropertyRecord<T, TValue> = Partial<
  Record<PropertyName<T>, TValue>
>;
