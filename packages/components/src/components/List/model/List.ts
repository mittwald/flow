import { ItemCollection } from "@/components/List/model/item/ItemCollection";
import { BatchesController } from "@/components/List/model/pagination/BatchesController";
import { Filter } from "./filter/Filter";
import { Sorting } from "@/components/List/model/sorting/Sorting";
import ReactTable from "@/components/List/model/ReactTable";
import type { ListShape, ListViewMode } from "@/components/List/model/types";
import { IncrementalLoader } from "@/components/List/model/loading/IncrementalLoader";
import invariant from "invariant";
import { Search } from "@/components/List/model/search/Search";
import { ItemView } from "@/components/List/model/item/ItemView";
import { Table } from "@/components/List/model/table/Table";
import { makeAutoObservable } from "mobx";
import { useRef } from "react";
import { useEffect } from "react";

export class List<T> {
  public readonly filters: Filter<T, never, never>[];
  public readonly itemView?: ItemView<T>;
  public readonly table?: Table<T>;
  public readonly search?: Search<T>;
  public readonly sorting: Sorting<T>[];
  public readonly items: ItemCollection<T>;
  public readonly reactTable: ReactTable<T>;
  public readonly batches: BatchesController<T>;
  public readonly loader: IncrementalLoader<T>;
  public readonly hasAction?: boolean;
  public viewMode: ListViewMode = "list";

  public constructor(shape: ListShape<T>) {
    const {
      itemView,
      table,
      filters = [],
      sorting = [],
      batchesController,
      hasAction,
      onChange,
    } = shape;

    this.items = new ItemCollection(this);
    this.filters = filters.map((shape) => new Filter(this, shape));
    this.sorting = sorting.map((shape) => new Sorting<T>(this, shape));
    this.search = shape.search ? new Search(this, shape.search) : undefined;
    this.itemView = itemView ? new ItemView(this, itemView) : undefined;
    this.table = table ? new Table(this, table) : undefined;
    this.batches = new BatchesController(this, batchesController);

    this.loader = IncrementalLoader.useNew<T>(this, shape.loader);
    this.reactTable = ReactTable.useNew(this, onChange, {
      manualFiltering: this.loader.manualFiltering,
      manualPagination: this.loader.manualPagination,
      manualSorting: this.loader.manualSorting,
    });

    useEffect(() => {
      this.filters.forEach((f) => f.deleteUnknownFilterValues());
    }, [this.filters]);

    this.hasAction = hasAction;

    makeAutoObservable(this, { viewMode: true, setViewMode: true });
  }

  public static useNew<T>(shape: ListShape<T>): List<T> {
    return useRef(new List<T>(shape)).current;
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

  public setViewMode(to: ListViewMode) {
    this.viewMode = to;
  }
}

export default List;
