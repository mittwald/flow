import { PropertyName, RenderItemFn } from "@/components/List/model/item/Item";
import { SortingShape } from "@/components/List/model/sorting/types";
import { PaginationShape } from "@/components/List/model/pagination/types";
import { FilterShape } from "@/components/List/model/filter/types";
import { IncrementalLoaderShape } from "@/components/List/model/loading/types";

export interface ListShape<T> {
  loader?: IncrementalLoaderShape<T>;
  render?: RenderItemFn<T>;
  filters?: FilterShape<T>[];
  sorting?: SortingShape<T>[];
  pagination?: PaginationShape;
  enableMultiSort?: boolean;
}

export type PropertyRecord<T, TValue> = Partial<
  Record<PropertyName<T>, TValue>
>;
