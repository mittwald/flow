import { ItemCollection } from "@/components/List/model/item/ItemCollection";
import { BatchesController } from "@/components/List/model/pagination/BatchesController";
import { Filter } from "./filter/Filter";
import { Sorting } from "@/components/List/model/sorting/Sorting";
import ReactTable from "@/components/List/model/ReactTable";
import type {
  GetItemId,
  ItemActionFn,
  ListShape,
  ListSupportedComponentProps,
  ListViewMode,
} from "@/components/List/model/types";
import { IncrementalLoader } from "@/components/List/model/loading/IncrementalLoader";
import invariant from "invariant";
import { Search } from "@/components/List/model/search/Search";
import { ItemView } from "@/components/List/model/item/ItemView";
import { Table } from "@/components/List/model/table/Table";
import { useEffect, useState } from "react";
import { useSettings } from "@/components/SettingsProvider/SettingsProvider";
import type { SettingsStore } from "@/components/SettingsProvider/models/SettingsStore";
import z from "zod";

export class List<T> {
  public static readonly viewModeSettingsStorageSchema = z
    .enum(["list", "table", "tiles"])
    .optional();
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
  public viewMode: ListViewMode;
  public readonly setViewMode: (viewMode: ListViewMode) => void;
  public readonly supportsSettingsStorage: boolean;
  public readonly settingStorageKey?: string;
  private readonly settingsStore?: SettingsStore;
  private readonly viewModeStorageKey?: string;
  private readonly filterSettingsStorageKey?: string;
  private readonly sortingStorageKey?: string;

  public constructor(shape: ListShape<T>) {
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
      ...componentProps
    } = shape;

    this.settingsStore = useSettings();
    this.settingStorageKey = settingStorageKey;
    this.filterSettingsStorageKey = settingStorageKey
      ? `${settingStorageKey}.activeFilters`
      : undefined;
    this.viewModeStorageKey = settingStorageKey
      ? `${settingStorageKey}.viewMode`
      : undefined;
    this.sortingStorageKey = settingStorageKey
      ? `${settingStorageKey}.sorting`
      : undefined;
    this.supportsSettingsStorage = !!this.settingStorageKey;

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
    this.reactTable = ReactTable.useNew(this, onChange, {
      manualFiltering: this.loader.manualFiltering,
      manualPagination: this.loader.manualPagination,
      manualSorting: this.loader.manualSorting,
    });

    const [viewMode, setViewMode] = useState(
      this.getStoredViewModeDefaultSetting() ?? defaultViewMode ?? "list",
    );
    this.viewMode = viewMode;

    this.setViewMode = (viewMode) => {
      setViewMode(viewMode);
      if (this.settingsStore && this.viewModeStorageKey) {
        this.settingsStore.set(
          "List",
          this.viewModeStorageKey,
          List.viewModeSettingsStorageSchema,
          viewMode,
        );
      }
    };

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
    return this.sorting.filter((s) => s.defaultEnabled !== "hidden");
  }

  public static useNew<T>(shape: ListShape<T>): List<T> {
    return new List<T>(shape);
  }

  public storeFilterDefaultSettings() {
    if (this.settingsStore && this.filterSettingsStorageKey) {
      const data = Object.fromEntries(
        this.filters.map((f) => [
          f.property,
          f
            .getArrayValue()
            .filter((v) => v.isActive)
            .map((v) => v.id),
        ]),
      );

      this.settingsStore.set(
        "List",
        this.filterSettingsStorageKey,
        Filter.settingsStorageSchema,
        data,
      );
    }
  }

  public getStoredFilterDefaultSettings() {
    if (this.settingsStore && this.filterSettingsStorageKey) {
      return this.settingsStore.get(
        "List",
        this.filterSettingsStorageKey,
        Filter.settingsStorageSchema,
      );
    }
  }

  public getStoredViewModeDefaultSetting() {
    if (this.settingsStore && this.viewModeStorageKey) {
      return this.settingsStore.get(
        "List",
        this.viewModeStorageKey,
        List.viewModeSettingsStorageSchema,
      );
    }
  }

  public storeSortingSettings(sorting: Sorting<T>) {
    if (this.settingsStore && this.sortingStorageKey) {
      this.settingsStore.set(
        "List",
        this.sortingStorageKey,
        Sorting.storageSchema,
        { direction: sorting.direction, property: sorting.property },
      );
    }
  }

  public getStoredSortingDefaultSetting() {
    if (this.settingsStore && this.sortingStorageKey) {
      return this.settingsStore.get(
        "List",
        this.sortingStorageKey,
        Sorting.storageSchema,
      );
    }
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
