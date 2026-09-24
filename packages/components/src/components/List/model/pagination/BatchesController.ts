import type List from "@/components/List/model/List";
import type {
  BatchesControllerShape,
  ListPaginationMode,
} from "@/components/List/model/pagination/types";
import type { Table } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export class BatchesController<T> {
  public readonly batchSize: number;
  public readonly mode: ListPaginationMode;
  public readonly autoLoadBatches: number;
  public readonly manualBatches: number;
  public readonly nextBatchSize: number;
  private readonly list: List<T>;
  private readonly loadedBatchesCount: number;
  private readonly setLoadedBatchesCount: Dispatch<SetStateAction<number>>;

  public constructor(list: List<T>, shape: BatchesControllerShape = {}) {
    const {
      batchSize = 20,
      mode,
      autoLoadBatches = 3,
      manualBatches = 1,
      nextBatchSize,
    } = shape;

    this.list = list;
    this.batchSize = batchSize;
    this.mode = mode ?? (list.infiniteScroll ? "infiniteScroll" : "button");
    this.autoLoadBatches = autoLoadBatches;
    this.manualBatches = manualBatches;
    this.nextBatchSize = nextBatchSize ?? batchSize * 3;

    const [loadedBatchesCount, setLoadedBatchesCount] = useState(1);
    this.loadedBatchesCount = loadedBatchesCount;
    this.setLoadedBatchesCount = setLoadedBatchesCount;

    list.filters.forEach((f) => f.onFilterUpdated(() => this.reset()));
    list.search?.onUpdated(() => this.reset());
  }

  private get reactTable(): Table<T> {
    return this.list.reactTable.table;
  }

  public getBatchIndex(): number {
    return this.reactTable.getState().pagination.pageIndex;
  }

  /** The number of batches the user has loaded, the first one included. */
  public getLoadedBatchesCount(): number {
    return this.loadedBatchesCount;
  }

  /** The number of items the batch at `batchIndex` loads. */
  public getBatchSize(batchIndex: number): number {
    if (this.mode === "growingBatches" && batchIndex > 0) {
      return this.nextBatchSize;
    }
    return this.batchSize;
  }

  /** The number of items loaded before the batch at `batchIndex`. */
  public getBatchOffset(batchIndex: number): number {
    if (this.mode === "growingBatches" && batchIndex > 0) {
      return this.batchSize + this.nextBatchSize * (batchIndex - 1);
    }
    return this.batchSize * batchIndex;
  }

  /** The number of items the batch loaded last brought in. */
  public getCurrentBatchSize(): number {
    return this.getBatchSize(this.loadedBatchesCount - 1);
  }

  /**
   * Whether the next batch loads when the user scrolls to the end of the list,
   * instead of when they press "Show more".
   */
  public isInfiniteScrollActive(): boolean {
    switch (this.mode) {
      case "infiniteScroll":
        return true;
      case "scrollThenButton":
        return this.loadedBatchesCount < this.autoLoadBatches;
      case "buttonThenScroll":
        return this.loadedBatchesCount > this.manualBatches;
      default:
        return false;
    }
  }

  public hasNextBatch(): boolean {
    if (this.list.loader.manualPagination) {
      const batchIndex = this.getBatchIndex();
      return (
        this.getBatchOffset(batchIndex) + this.getBatchSize(batchIndex) <
        this.getTotalItemsCount()
      );
    }
    return (
      this.reactTable.getState().pagination.pageSize < this.getTotalItemsCount()
    );
  }

  public getTotalItemsCount(): number {
    if (this.list.loader.manualPagination) {
      return this.reactTable.getRowCount();
    }
    return this.reactTable.getFilteredRowModel().rows.length;
  }

  public getVisibleItemsCount(): number {
    return this.reactTable.getRowModel().rows.length ?? 0;
  }

  public updateItemTotalCount(value: number): void {
    this.reactTable.setOptions((s) => ({
      ...s,
      rowCount: value,
    }));
  }

  public reset(): void {
    if (this.list.loader.manualFiltering) {
      this.updateItemTotalCount(0);
    }
    this.setLoadedBatchesCount(1);
    this.reactTable.setPagination(() => ({
      pageIndex: 0,
      pageSize: this.batchSize,
    }));
  }

  public nextBatch(): void {
    this.setLoadedBatchesCount((count) => count + 1);

    if (this.list.loader.manualPagination) {
      this.reactTable.nextPage();
    } else {
      const newSize =
        this.reactTable.getState().pagination.pageSize +
        this.getBatchSize(this.loadedBatchesCount);

      this.reactTable.setPagination((prev) => ({
        ...prev,
        pageSize: newSize,
      }));
    }
  }
}
