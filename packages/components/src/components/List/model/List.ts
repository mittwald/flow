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
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useSettings } from "@/components/SettingsProvider/SettingsProvider";
import type { SettingsStore } from "@/components/SettingsProvider/models/SettingsStore";
import { ActionGroup } from "./ActionGroup";

export class List<T> {
  public readonly settingStorageKey?: string;
  public readonly supportsSettingsStorage: boolean;
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
  public readonly getItemId?: GetItemId<T>;
  public readonly componentProps: ListSupportedComponentProps;
  public viewMode: ListViewMode;
  public readonly setViewMode: Dispatch<SetStateAction<ListViewMode>>;
  public readonly actionGroup?: ActionGroup;
  private readonly filterSettingsStorageKey?: string;
  private readonly defaultSettings?: SettingsStore;

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
      actionGroup,
      defaultViewMode,
      ...componentProps
    } = shape;

    this.defaultSettings = useSettings();
    this.settingStorageKey = settingStorageKey;
    this.filterSettingsStorageKey = settingStorageKey
      ? `${settingStorageKey}.activeFilters`
      : undefined;
    this.supportsSettingsStorage = !!this.settingStorageKey;

    this.items = new ItemCollection(this);
    this.filters = filters.map((shape) => new Filter(this, shape));
    this.sorting = sorting.map((shape) => new Sorting<T>(this, shape));
    this.search = search ? new Search(this, search) : undefined;
    this.itemView = itemView ? new ItemView(this, itemView) : undefined;
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
    this.actionGroup = actionGroup ? new ActionGroup() : undefined;

    const [viewMode, setViewMode] = useState(defaultViewMode ?? "list");
    this.viewMode = viewMode;
    this.setViewMode = setViewMode;

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
    if (this.defaultSettings && this.filterSettingsStorageKey) {
      const data = Object.fromEntries(
        this.filters.map((f) => [
          f.property,
          f
            .getArrayValue()
            .filter((v) => v.isActive)
            .map((v) => v.value),
        ]),
      );

      this.defaultSettings.set(
        "List",
        this.filterSettingsStorageKey,
        Filter.settingsStorageSchema,
        data,
      );
    }
  }

  public getStoredFilterDefaultSettings() {
    if (this.defaultSettings && this.filterSettingsStorageKey) {
      return this.defaultSettings.get(
        "List",
        this.filterSettingsStorageKey,
        Filter.settingsStorageSchema,
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

  public useIsEmpty(): boolean {
    return !this.loader.useIsLoading() && this.items.entries.length === 0;
  }
}

export default List;
