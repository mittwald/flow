import List from "@/components/List/model/List";
import { PaginationShape } from "@/components/List/model/pagination/types";

export class Pagination<T> {
  private readonly list: List<T>;
  public readonly initialPageSize: number;

  public constructor(list: List<T>, shape: PaginationShape = {}) {
    const { pageSize = 20 } = shape;

    this.list = list;
    this.initialPageSize = pageSize;
  }

  public getPageIndex(): number {
    return this.list.reactTable.table.getState().pagination.pageIndex;
  }

  public hasNextPage(): boolean {
    return this.list.reactTable.table.getCanNextPage();
  }

  public nextPage(): void {
    this.list.reactTable.table.nextPage();
  }

  public updatePageSize(size: number): void {
    this.list.reactTable.table.setPagination((prev) => ({
      ...prev,
      pageSize: size,
    }));
  }

  public getPageSize(): number {
    return this.list.reactTable.table.getState().pagination.pageSize;
  }

  public getTotalItemsCount(): number | undefined {
    return this.list.reactTable.table.getRowCount();
  }

  public getFilteredItemsCount(): number {
    return this.list.reactTable.table.getFilteredRowModel().rows.length;
  }

  public getVisibleItemsCount(): number | undefined {
    return this.list.reactTable.table.getRowModel().rows.length;
  }

  public updateItemTotalCount(value: number): void {
    this.list.reactTable.table.setOptions((s) => ({
      ...s,
      rowCount: value,
    }));
  }
}
