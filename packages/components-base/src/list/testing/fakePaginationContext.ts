import type { ListPaginationContext } from "../pagination/ListBatchesController";
import type { ListLoaderModes } from "../pagination/types";
import type { PaginationState, Row, Table } from "@tanstack/table-core";

export interface FakePaginationContextOptions {
  /** Every row the data source produced, before paging. */
  rows?: string[];
  /** What the server said the total is — only read in manual pagination. */
  rowCount?: number;
  /**
   * The page size the table started with. In a real list that is the
   * controller's `batchSize`, written into the table's initial state — the
   * controller itself never sets it before the first `reset()`.
   */
  pageSize?: number;
  loader?: Partial<ListLoaderModes>;
}

export interface FakePaginationContext extends ListPaginationContext<string> {
  pagination: PaginationState;
  rowCount: number;
  setOptionsCalls: number;
}

/**
 * Just enough TanStack table to page through a list of strings.
 *
 * Kept apart from `fakeContext`: paging is about row models and pagination
 * state, sorting and searching are about a column and the settings store, and
 * one fake that did both would be mostly irrelevant to each test that used it.
 */
export const fakePaginationContext = (
  options: FakePaginationContextOptions = {},
): FakePaginationContext => {
  const rows = options.rows ?? [];

  const asRows = (values: string[]): Row<string>[] =>
    values.map((value, index) => ({
      id: String(index),
      original: value,
    })) as unknown as Row<string>[];

  const context: FakePaginationContext = {
    pagination: { pageIndex: 0, pageSize: options.pageSize ?? 20 },
    rowCount: options.rowCount ?? rows.length,
    setOptionsCalls: 0,

    loader: {
      manualPagination: false,
      manualFiltering: false,
      manualSorting: false,
      ...options.loader,
    },

    get dataTable(): Table<string> {
      return {
        getState: () => ({ pagination: context.pagination }),
        setPagination: (
          updater: (prev: PaginationState) => PaginationState,
        ) => {
          context.pagination = updater(context.pagination);
        },
        nextPage: () => {
          context.pagination = {
            ...context.pagination,
            pageIndex: context.pagination.pageIndex + 1,
          };
        },
        getCanNextPage: () =>
          (context.pagination.pageIndex + 1) * context.pagination.pageSize <
          context.rowCount,
        getRowCount: () => context.rowCount,
        getFilteredRowModel: () => ({ rows: asRows(rows) }),
        getRowModel: () => ({
          rows: asRows(rows.slice(0, context.pagination.pageSize)),
        }),
        setOptions: (
          updater: (prev: { rowCount: number }) => { rowCount: number },
        ) => {
          context.setOptionsCalls += 1;
          context.rowCount = updater({ rowCount: context.rowCount }).rowCount;
        },
      } as unknown as Table<string>;
    },
  };

  return context;
};
