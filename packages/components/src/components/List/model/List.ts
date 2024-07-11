import { ItemCollection } from "@/components/List/model/item/ItemCollection";
import { BatchesController } from "@/components/List/model/pagination/BatchesController";
import { Filter } from "./filter/Filter";
import { Sorting } from "@/components/List/model/sorting/Sorting";
import ReactTable from "@/components/List/model/ReactTable";
import type { ListShape } from "@/components/List/model/types";
import { IncrementalLoader } from "@/components/List/model/loading/IncrementalLoader";
import invariant from "invariant";
import type { RenderItemFn } from "@/components/List/model/item/types";

export class List<T> {
  public readonly filters: Filter<T, never, never>[];
  public readonly sorting: Sorting<T>[];
  public readonly items: ItemCollection<T>;
  public readonly render?: RenderItemFn<T>;
  public readonly reactTable: ReactTable<T>;
  public readonly batches: BatchesController<T>;
  public readonly loader: IncrementalLoader<T>;

  private constructor(shape: ListShape<T>) {
    const { render, filters = [], sorting = [], batchesController } = shape;

    this.render = render;

    this.items = ItemCollection.useNew(this);
    this.filters = filters.map((shape) => new Filter(this, shape));
    this.sorting = sorting.map((shape) => new Sorting<T>(this, shape));

    this.batches = new BatchesController(this, batchesController);

    this.loader = IncrementalLoader.useNew<T>(this, shape.loader);
    this.reactTable = ReactTable.useNew(this, {
      manualFiltering: this.loader.manualFiltering,
      manualPagination: this.loader.manualPagination,
      manualSorting: this.loader.manualSorting,
    });
  }

  public static useNew<T>(shape: ListShape<T>): List<T> {
    return new List<T>(shape);
  }

  public isFiltered(): boolean {
    return this.filters.some((f) => f.isActive());
  }

  public getSorting(id: string): Sorting<T> {
    const sorting = this.sorting.find((s) => s.id === id);
    invariant(!!sorting, `Could not get Sorting (ID: ${id})`);
    return sorting;
  }

  public clearSorting(): void {
    return this.sorting.forEach((s) => s.clear());
  }

  public clearFilters(): void {
    return this.filters.forEach((f) => f.clearValues());
  }

  public useIsEmpty(): boolean {
    return !this.loader.useIsLoading() && this.items.entries.length === 0;
  }
}

export default List;
