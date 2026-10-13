import type {
  ListAsyncDataLoader,
  ListData,
  ListDataLoaderOptions,
  ListDataLoaderResult,
} from "@mittwald/flow-components-base";
import type { AsyncResource } from "@mittwald/react-use-promise";
import type { DependencyList } from "react";

/*
 * The loader contract is a consumer-facing API and identical in every binding,
 * so it lives in the shared model — aliased, not re-exported, because a
 * re-export does not bring the names into this file's scope.
 */
export type DataLoaderOptions<T> = ListDataLoaderOptions<T>;
export type DataLoaderResult<T> = ListDataLoaderResult<T>;
export type { ListData };

export type HooksDataLoader<T> = (
  options: DataLoaderOptions<T>,
) => DataLoaderResult<T>;

export type AsyncDataLoader<T> = ListAsyncDataLoader<T>;

export type AsyncResourceFactory<T> = (
  options?: DataLoaderOptions<T>,
) => AsyncResource<DataLoaderResult<T>>;

interface DynamicLoaderShape {
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
}

interface SuspenseLoaderShape {
  /**
   * Whether the List renders no own Suspense boundary while it initially loads.
   * Suspending is then handed over to the closest Suspense boundary above the
   * List, so the List appears with loaded data instead of showing its loading
   * view (skeleton) first.
   *
   * @default false
   */
  disableInitialSuspenseBoundary?: boolean;
}

export interface StaticDataLoaderShape<T> {
  staticData: ListData<T>;
}

export type AsyncResourceFactoryDataLoaderShape<T> = {
  asyncResourceFactory: AsyncResourceFactory<T>;
} & DynamicLoaderShape &
  SuspenseLoaderShape;

export type AsyncDataLoaderShape<T> = {
  asyncLoader: AsyncDataLoader<T>;
  dependencies?: DependencyList;
} & DynamicLoaderShape &
  SuspenseLoaderShape;

export type HooksDataLoaderShape<T> = {
  useData: HooksDataLoader<T>;
} & DynamicLoaderShape &
  SuspenseLoaderShape;

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
