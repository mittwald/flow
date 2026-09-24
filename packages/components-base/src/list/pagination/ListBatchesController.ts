import type { ListModelContext } from "../ListModelContext";
import type { ListBatchesControllerShape, ListLoaderModes } from "./types";

/**
 * The context a batches controller needs: the table, plus who does the paging.
 *
 * Declared here rather than folded into `ListModelContext`, so a model that
 * only sorts or filters is not made to carry a loader it never asks anything.
 */
export interface ListPaginationContext<T> extends ListModelContext<T> {
  readonly loader: ListLoaderModes;
}

/**
 * How much of the list is shown, in batches of `batchSize`.
 *
 * Resetting on a changed filter or search is **not** wired here: the filters
 * and the search belong to the list that assembles them, and it is the list
 * that calls `reset()`. Keeping the wiring out also keeps the variance trap out
 * — a list of concrete filters is not assignable to a list of generic ones.
 */
export class ListBatchesController<T> {
  public readonly batchSize: number;
  private readonly context: ListPaginationContext<T>;

  public constructor(
    context: ListPaginationContext<T>,
    shape: ListBatchesControllerShape = {},
  ) {
    const { batchSize = 20 } = shape;

    this.context = context;
    this.batchSize = batchSize;
  }

  private get dataTable() {
    return this.context.dataTable;
  }

  public getBatchIndex(): number {
    return this.dataTable.getState().pagination.pageIndex;
  }

  public hasNextBatch(): boolean {
    if (this.context.loader.manualPagination) {
      return this.dataTable.getCanNextPage();
    }
    return (
      this.dataTable.getState().pagination.pageSize < this.getTotalItemsCount()
    );
  }

  public getTotalItemsCount(): number {
    if (this.context.loader.manualPagination) {
      return this.dataTable.getRowCount();
    }
    return this.dataTable.getFilteredRowModel().rows.length;
  }

  public getVisibleItemsCount(): number {
    return this.dataTable.getRowModel().rows.length ?? 0;
  }

  public updateItemTotalCount(value: number): void {
    this.dataTable.setOptions((s) => ({
      ...s,
      rowCount: value,
    }));
  }

  public reset(): void {
    if (this.context.loader.manualFiltering) {
      this.updateItemTotalCount(0);
    }
    this.dataTable.setPagination(() => ({
      pageIndex: 0,
      pageSize: this.batchSize,
    }));
  }

  public nextBatch(): void {
    if (this.context.loader.manualPagination) {
      this.dataTable.nextPage();
      return;
    }

    this.dataTable.setPagination((prev) => ({
      ...prev,
      pageSize: prev.pageSize + this.batchSize,
    }));
  }
}
