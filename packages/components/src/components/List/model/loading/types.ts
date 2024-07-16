import type { PropertyRecord } from "@/components/List/model/types";
import type { FilterMode } from "@/components/List/model/filter/types";
import type { AsyncResource } from "@mittwald/react-use-promise";
import type { SearchValue } from "@/components/List/model/search/types";

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

export interface DataLoaderResult<T> {
  data: T[];
  itemTotalCount?: number;
}

export type AsyncDataLoader<T> = (
  options?: DataLoaderOptions<T>,
) => Promise<DataLoaderResult<T>>;

type AsyncResourceFactory<T> = (
  options?: DataLoaderOptions<T>,
) => AsyncResource<DataLoaderResult<T>>;

type StaticData<T> = T[];

interface DynamicLoaderShape {
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
}

export interface StaticDataLoaderShape<T> {
  staticData: StaticData<T>;
}

export type AsyncResourceFactoryDataLoaderShape<T> = {
  asyncResourceFactory: AsyncResourceFactory<T>;
} & DynamicLoaderShape;

export type AsyncDataLoaderShape<T> = {
  asyncLoader: AsyncDataLoader<T>;
} & DynamicLoaderShape;

export type DataSource<T> =
  | StaticDataLoaderShape<T>
  | AsyncResourceFactoryDataLoaderShape<T>
  | AsyncDataLoaderShape<T>;

export interface IncrementalLoaderShape<T> {
  source?: DataSource<T>;
}
