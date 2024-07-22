import { ItemCollection } from "@/components/List/model/item/ItemCollection";
import { BatchesController } from "@/components/List/model/pagination/BatchesController";
import { Filter } from "./filter/Filter";
import { Sorting } from "@/components/List/model/sorting/Sorting";
import ReactTable from "@/components/List/model/ReactTable";
import type { ListShape } from "@/components/List/model/types";
import { IncrementalLoader } from "@/components/List/model/loading/IncrementalLoader";
import invariant from "invariant";
import { Search } from "@/components/List/model/search/Search";
import { ItemView } from "@/components/List/model/item/ItemView";

export class List<T> {
  public readonly filters: Filter<T, never, never>[];
  public readonly itemView: ItemView<T>;
  public readonly search?: Search<T>;
  public readonly sorting: Sorting<T>[];
  public readonly items: ItemCollection<T>;
  public readonly reactTable: ReactTable<T>;
  public readonly batches: BatchesController<T>;
  public readonly loader: IncrementalLoader<T>;
  public readonly hasAction: boolean;

  private constructor(shape: ListShape<T>) {
    const {
      itemView,
      filters = [],
      sorting = [],
      batchesController,
      hasAction,
    } = shape;

    this.items = new ItemCollection(this);
    this.filters = filters.map((shape) => new Filter(this, shape));
    this.sorting = sorting.map((shape) => new Sorting<T>(this, shape));
    this.search = shape.search ? new Search(this, shape.search) : undefined;
    this.itemView = new ItemView(this, itemView);
    this.batches = new BatchesController(this, batchesController);

    this.loader = IncrementalLoader.useNew<T>(this, shape.loader);
    this.reactTable = ReactTable.useNew(this, {
      manualFiltering: this.loader.manualFiltering,
      manualPagination: this.loader.manualPagination,
      manualSorting: this.loader.manualSorting,
    });

    this.hasAction = hasAction;
  }

  public static useNew<T>(shape: ListShape<T>): List<T> {
    return new List<T>(shape);
  }

  public get isFiltered(): boolean {
    return (
      this.filters.some((f) => f.isActive()) ||
      (!!this.search && this.search.isSet)
    );
  }

  public get visibleSorting() {
    return this.sorting.filter((s) => s.defaultEnabled !== "hidden");
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
    this.search?.clear();
    return this.filters.forEach((f) => f.clearValues());
  }

  public useIsEmpty(): boolean {
    return !this.loader.useIsLoading() && this.items.entries.length === 0;
  }
}

export default List;
