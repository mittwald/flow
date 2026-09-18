import type { FilterMode } from "../filter/types";
import type { ListLoaderModes } from "../pagination/types";
import type { SearchValue } from "../search/types";
import type { ListSorting } from "../sorting/ListSorting";
import type { PropertyName } from "../types";

/** One batch of list data, as a loader hands it over. */
export type ListData<T> = readonly T[];

/**
 * How far one batch has got.
 *
 * The same four values `@mittwald/react-use-promise` uses, spelled out rather
 * than imported: that package is React's, and this one is the half both
 * bindings share.
 */
export type BatchLoadingState = "void" | "loading" | "loaded" | "error";

/** A value per property of `T`, e.g. a direction or a filter's selection. */
export type ListPropertyRecord<T, TValue> = Partial<
  Record<PropertyName<T>, TValue>
>;

interface ListDataLoaderPaginationOptions {
  offset: number;
  limit: number;
}

/**
 * What a list asks its data source for.
 *
 * The consumer-facing contract of every dynamic loader, and the reason it is
 * here rather than with a binding: a Vue app and a React app write the same
 * loader function. Each field is filled only where the source said it does that
 * job itself — see `ListLoaderModes`.
 */
export interface ListDataLoaderOptions<T> {
  sorting?: ListPropertyRecord<T, "asc" | "desc">;
  filtering?: ListPropertyRecord<T, { mode: FilterMode; values: unknown[] }>;
  searchString?: SearchValue;
  pagination?: ListDataLoaderPaginationOptions;
}

export interface ListDataLoaderResult<T> {
  data: ListData<T>;
  itemTotalCount?: number;
  metadata?: unknown;
}

export type ListAsyncDataLoader<T> = (
  options: ListDataLoaderOptions<T>,
) => Promise<ListDataLoaderResult<T>>;

/** What building the loader options needs of a filter, and nothing more. */
export interface QueryableFilter<T> {
  readonly property: PropertyName<T>;
  readonly mode: FilterMode;
  getValue(): unknown;
  getArrayValue(): { value: unknown }[];
}

export interface ListDataLoaderOptionsSource<T> {
  readonly batchSize: number;
  readonly modes: ListLoaderModes;
  readonly sorting: ListSorting<T>[];
  readonly filters: QueryableFilter<T>[];
  readonly searchString: SearchValue;
}

/**
 * The query for one batch.
 *
 * Every branch is the same question — "does the source do this itself?" — and
 * getting it wrong is silent: a source that paginates but is sent no pagination
 * returns its first page forever.
 */
export const getListDataLoaderOptions = <T>(
  source: ListDataLoaderOptionsSource<T>,
  batchIndex: number,
): ListDataLoaderOptions<T> => {
  const { batchSize, modes } = source;

  return {
    pagination: modes.manualPagination
      ? { limit: batchSize, offset: batchSize * batchIndex }
      : undefined,

    sorting: modes.manualSorting
      ? (Object.fromEntries(
          source.sorting
            .filter((s) => s.isSorted())
            .map((s) => [s.property, s.direction]),
        ) as ListDataLoaderOptions<T>["sorting"])
      : undefined,

    filtering: modes.manualFiltering
      ? (Object.fromEntries(
          source.filters
            .filter((f) => f.getValue() !== null)
            .map((f) => [
              f.property,
              { mode: f.mode, values: f.getArrayValue().map((v) => v.value) },
            ]),
        ) as ListDataLoaderOptions<T>["filtering"])
      : undefined,

    searchString: modes.manualFiltering ? source.searchString : undefined,
  };
};
