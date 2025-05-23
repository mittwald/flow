import type List from "@/components/List/model/List";
import type { BatchesControllerShape } from "@/components/List/model/pagination/types";
import type { Table } from "@tanstack/react-table";

export class BatchesController<T> {
  public readonly batchSize: number;
  private readonly list: List<T>;

  public constructor(list: List<T>, shape: BatchesControllerShape = {}) {
    const { batchSize = 20 } = shape;

    this.list = list;
    this.batchSize = batchSize;
    list.filters.forEach((f) => f.onFilterUpdated(() => this.reset()));
    list.search?.onUpdated(() => this.reset());
  }

  private get reactTable(): Table<T> {
    return this.list.reactTable.table;
  }

  public getBatchIndex(): number {
    return this.reactTable.getState().pagination.pageIndex;
  }

  public hasNextBatch(): boolean {
    const filteredRowCount = this.reactTable.getFilteredRowModel().rows.length;
    if (filteredRowCount <= this.batchSize) {
      return false;
    }
    return this.reactTable.getCanNextPage();
  }

  public getTotalItemsCount(): number {
    return this.reactTable.getRowCount() ?? 0;
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
    this.reactTable.setPagination(() => ({
      pageIndex: 0,
      pageSize: this.batchSize,
    }));
  }

  public nextBatch(): void {
    if (this.list.loader.manualPagination) {
      this.reactTable.nextPage();
    } else {
      const newSize =
        this.reactTable.getState().pagination.pageSize + this.batchSize;

      this.reactTable.setPagination((prev) => ({
        ...prev,
        pageSize: newSize,
      }));
    }
  }
}
