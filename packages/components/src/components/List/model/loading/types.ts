import type { PropertyRecord } from "@/components/List/model/types";
import type { FilterMode } from "@/components/List/model/filter/types";
import type { AsyncResource } from "@mittwald/react-use-promise";
import type { SearchValue } from "@/components/List/model/search/types";
import type { DependencyList } from "react";

type DataLoaderSortOptions<T> = PropertyRecord<T, "asc" | "desc">;

type DataLoaderFilterOptions<T> = PropertyRecord<
  T,
  { mode: FilterMode; values: unknown[] }
>;

interface DataLoaderPaginationOptions {
  offset: number;
  limit: number;
}

export interface DataLoaderOptions<T> {
  sorting?: DataLoaderSortOptions<T>;
  filtering?: DataLoaderFilterOptions<T>;
  searchString?: SearchValue;
  pagination?: DataLoaderPaginationOptions;
}

export type ListData<T> = readonly T[];

export interface DataLoaderResult<T> {
  data: ListData<T>;
  itemTotalCount?: number;
  metadata?: unknown;
}

export type HooksDataLoader<T> = (
  options: DataLoaderOptions<T>,
) => DataLoaderResult<T>;

export type AsyncDataLoader<T> = (
  options: DataLoaderOptions<T>,
) => Promise<DataLoaderResult<T>>;

export type AsyncResourceFactory<T> = (
  options?: DataLoaderOptions<T>,
) => AsyncResource<DataLoaderResult<T>>;

interface DynamicLoaderShape {
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
}

export interface StaticDataLoaderShape<T> {
  staticData: ListData<T>;
}

export type AsyncResourceFactoryDataLoaderShape<T> = {
  asyncResourceFactory: AsyncResourceFactory<T>;
} & DynamicLoaderShape;

export type AsyncDataLoaderShape<T> = {
  asyncLoader: AsyncDataLoader<T>;
  dependencies?: DependencyList;
} & DynamicLoaderShape;

export type HooksDataLoaderShape<T> = {
  useData: HooksDataLoader<T>;
} & DynamicLoaderShape;

export type DataSource<T> =
  | StaticDataLoaderShape<T>
  | HooksDataLoaderShape<T>
  | AsyncResourceFactoryDataLoaderShape<T>
  | AsyncDataLoaderShape<T>;

export interface IncrementalLoaderShape<T> {
  source?: DataSource<T>;
}

export interface LoaderInvocationHook {
  useLoadBatch: () => void;
  useRenderSuspense: () => void;
}
