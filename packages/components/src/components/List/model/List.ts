import { ItemCollection } from "@/components/List/model/item/ItemCollection";
import { BatchesController } from "@/components/List/model/pagination/BatchesController";
import { Filter } from "./filter/Filter";
import { Sorting } from "@/components/List/model/sorting/Sorting";
import ReactTable from "@/components/List/model/ReactTable";
import type {
  GetItemId,
  ItemActionFn,
  ListSettingsStorageDefaults,
  ListShape,
  ListSupportedComponentProps,
} from "@/components/List/model/types";
import { IncrementalLoader } from "@/components/List/model/loading/IncrementalLoader";
import invariant from "invariant";
import { Search } from "@/components/List/model/search/Search";
import { ItemView } from "@/components/List/model/item/ItemView";
import { Table } from "@/components/List/model/table/Table";
import { useEffect } from "react";
import { ListSettingsStore } from "./ListSettingsStore";
import { ListViewMode } from "./ListViewMode";
import { useSettings } from "@/components/SettingsProvider/SettingsProvider";

export class List<T = unknown, TMeta = unknown> {
  public readonly filters: Filter<T, never, never>[];
  public readonly itemView?: ItemView<T>;
  public readonly table?: Table<T>;
  public readonly search?: Search<T>;
  public readonly sorting: Sorting<T>[];
  public readonly items: ItemCollection<T>;
  public readonly reactTable: ReactTable<T>;
  public readonly batches: BatchesController<T>;
  public readonly loader: IncrementalLoader<T>;
  public readonly onAction?: ItemActionFn<T>;
  public readonly accordion: boolean;
  public readonly getItemId?: GetItemId<T>;
  public readonly componentProps: ListSupportedComponentProps;
  public metadata?: TMeta;
  public readonly settingsStorage?: ListSettingsStore<T>;
  public readonly loadingItemsCount;
  public readonly viewMode: ListViewMode<T>;
  public readonly settingsStorageDefaults?: ListSettingsStorageDefaults;

  public constructor(shape: ListShape<T, TMeta>) {
    const {
      settingStorageKey,
      itemView,
      table,
      filters = [],
      sorting = [],
      batchesController,
      onChange,
      loader,
      search,
      onAction,
      getItemId,
      defaultViewMode,
      accordion = false,
      loadingItemsCount = 5,
      settingsStorageDefaults,
      ...componentProps
    } = shape;

    this.settingsStorageDefaults = settingsStorageDefaults;
    const generalSettingsStore = useSettings();

    this.settingsStorage =
      settingStorageKey && generalSettingsStore
        ? new ListSettingsStore(this, generalSettingsStore, {
            storageKey: settingStorageKey,
          })
        : undefined;

    this.items = new ItemCollection(this);
    this.filters = filters.map((shape) => new Filter(this, shape));
    this.sorting = sorting.map((shape) => new Sorting<T>(this, shape));
    this.search = search ? new Search(this, search) : undefined;
    this.itemView = itemView ? new ItemView(this, itemView) : undefined;
    this.accordion = accordion;
    this.table = table ? new Table(this, table) : undefined;
    this.batches = new BatchesController(this, batchesController);
    this.componentProps = componentProps;
    this.loader = IncrementalLoader.useNew<T>(this, loader);
    this.onAction = onAction;
    this.getItemId = getItemId;
    this.loadingItemsCount = loadingItemsCount;
    this.reactTable = ReactTable.useNew(this, onChange, {
      manualFiltering: this.loader.manualFiltering,
      manualPagination: this.loader.manualPagination,
      manualSorting: this.loader.manualSorting,
    });
    this.viewMode = new ListViewMode(this, { defaultViewMode });

    useEffect(() => {
      this.filters.forEach((f) => f.deleteUnknownFilterValues());
    }, [this.filters]);
  }

  public get isFiltered(): boolean {
    return (
      this.filters.some((f) => f.isActive()) ||
      (!!this.search && this.search.isSet)
    );
  }

  public get visibleSorting() {
    return this.sorting.filter((s) => s.initialEnabled !== "hidden");
  }

  public static useNew<T, TMeta = unknown>(
    shape: ListShape<T, TMeta>,
  ): List<T, TMeta> {
    return new List<T, TMeta>(shape);
  }

  public getSorting(id: string): Sorting<T> {
    const sorting = this.sorting.find((s) => s.id === id);
    invariant(!!sorting, `Could not get Sorting (ID: ${id})`);
    return sorting;
  }

  public clearSorting(): void {
    return this.sorting.forEach((s) => s.clear());
  }

  public resetFilters(): void {
    return this.filters.forEach((f) => f.resetValues());
  }

  public clearFilters(): void {
    return this.filters.forEach((f) => f.clear());
  }

  public useIsEmpty(): boolean {
    return !this.loader.useIsLoading() && this.items.entries.length === 0;
  }
}

export default List;
