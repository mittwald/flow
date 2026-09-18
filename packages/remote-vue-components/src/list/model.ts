import type {
  ListDataLoaderOptions,
  ListData,
  ListDataLoaderResult,
  ListLoaderModes,
  ListPaginationContext,
  ListItem,
  ListSettingsPort,
  PropertyName,
} from "@mittwald/flow-components-base";
import {
  getListDataLoaderOptions,
  ListBatchesController,
  ListFilter,
  ListItemCollection,
  ListLoaderState,
  ListSearch,
  ListSorting,
  ListTable,
  ListViewMode,
  mergeHiddenSorting,
} from "@mittwald/flow-components-base";
import { action, makeObservable, observable } from "mobx";
import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/table-core";
import type {
  ColumnDef,
  ColumnSort,
  InitialTableState,
  Table,
  TableOptions,
} from "@tanstack/table-core";
import type { ListRendered, VueListShape } from "./types";

const emptyData: never[] = [];

/**
 * Flow's list, without React.
 *
 * Every rule it follows — the batches, the filters, the sorting, the search,
 * the view mode, the table — is `@mittwald/flow-components-base`, the same
 * objects `packages/components` builds its list from. What is assembled here is
 * only the wiring, plus the one thing the shared model deliberately left to a
 * binding: fetching a batch.
 *
 * It is a plain object, not a Vue reactive one. Its state is MobX, and a
 * component reads it through `watchMobxValue`.
 */
export class ListModel<T> implements ListPaginationContext<T> {
  public readonly shape: VueListShape<T>;
  public readonly loaderState: ListLoaderState<T>;
  public readonly loader: ListLoaderModes;
  public readonly staticDataProperties: PropertyName<T>[] = [];
  public readonly filters: ListFilter<T, never, never, ListRendered>[];
  public readonly sorting: ListSorting<T>[];
  public readonly search?: ListSearch<T>;
  public readonly listTable: ListTable<T>;
  public readonly items: ListItemCollection<T>;
  public readonly batches: ListBatchesController<T>;
  public readonly viewMode: ListViewMode;

  /**
   * Controlled, because a hidden sorting has to survive a click on a visible
   * one — the table's own updater replaces the whole array.
   */
  public sortingState: ColumnSort[];

  private currentData: readonly T[] = emptyData;

  public constructor(shape: VueListShape<T>) {
    this.shape = shape;

    this.loader = {
      manualPagination: shape.manualPagination ?? false,
      manualFiltering: shape.manualFiltering ?? shape.manualPagination ?? false,
      manualSorting: shape.manualSorting ?? shape.manualPagination ?? false,
    };

    this.loaderState = new ListLoaderState<T>({ getItemId: shape.getItemId });
    this.collectStaticDataProperties();

    this.filters = (shape.filters ?? []).map(
      (filterShape) =>
        new ListFilter<T, never, never, ListRendered>(
          this,
          filterShape as never,
        ),
    );
    this.sorting = (shape.sorting ?? []).map(
      (sortingShape) => new ListSorting<T>(this, sortingShape),
    );
    this.search = shape.search
      ? new ListSearch<T>(this, shape.search)
      : undefined;

    this.sortingState = this.sorting
      .filter((s) => s.initialEnabled !== false)
      .map((s) => s.getReactTableColumnSort());

    makeObservable(this, {
      sortingState: observable.ref,
      setSortingState: action.bound,
    });

    this.listTable = new ListTable<T>(this.getTableOptions(emptyData));
    this.items = new ListItemCollection<T>(this);
    this.batches = new ListBatchesController<T>(this, {
      batchSize: shape.batchSize,
    });
    this.viewMode = new ListViewMode({
      defaultValue: shape.defaultViewMode,
      settings: this.settings,
    });

    /* The list owns the filters, so the list wires what a change resets. */
    this.filters.forEach((f) =>
      f.onFilterUpdated(() => {
        this.batches.reset();
        this.loaderState.reset();
        ListFilter.storeFilters(this, this.filters, { autosave: true });
      }),
    );
    this.search?.onUpdated(() => {
      this.batches.reset();
      this.loaderState.reset();
    });
  }

  /* `ListModelContext` — what the shared model reaches for. */
  public get dataTable(): Table<T> {
    return this.listTable.table;
  }

  public get settings(): ListSettingsPort | undefined {
    return this.shape.settings;
  }

  public setSortingState(next: ColumnSort[]): void {
    this.sortingState = next;
    /*
     * The options carry the sorting, so changing the state alone changes
     * nothing: `ListTable` re-applies the options it was last handed, and the
     * sorting in those is the one from before this call.
     */
    this.listTable.setOptions(this.getTableOptions(this.currentData));
  }

  public get loadingItemsCount(): number {
    return this.shape.loadingItemsCount ?? this.batches.batchSize;
  }

  public get hasActiveFilters(): boolean {
    /*
     * Another read of the table's state, so another read of the revision —
     * without it the empty view keeps saying "no items" after a filter has
     * emptied the list, which is a different sentence and a different icon.
     */
    void this.listTable.revision;
    return this.filters.some((f) => f.isActive());
  }

  public get visibleSorting(): ListSorting<T>[] {
    return this.sorting.filter((s) => s.initialEnabled !== "hidden");
  }

  /**
   * The items the table currently shows.
   *
   * Reading the table's `revision` is the subscription: the rows come out of
   * the options and the state, and `revision` is the only observable that moves
   * when either does.
   */
  public get renderedItems(): ListItem<T>[] {
    void this.listTable.revision;
    return this.items.entries;
  }

  public get isEmpty(): boolean {
    /*
     * `renderedItems`, not `items.entries`: the data reaches the table one
     * turn after the loader reports it, and reading the rows without the
     * table's revision leaves this stuck on the answer from before.
     */
    return !this.loaderState.isLoading && this.renderedItems.length === 0;
  }

  public getEmptyViewType(): "search" | "list" {
    return this.hasActiveFilters || this.search?.isSet ? "search" : "list";
  }

  public clearSorting(): void {
    this.sorting.forEach((s) => s.clear());
  }

  public resetFilters(): void {
    this.filters.forEach((f) => f.resetValues());
  }

  /**
   * Replaces the data a static list shows.
   *
   * The loader state goes with it: the batches describe the old array, and
   * keeping them would merge the two.
   */
  public setStaticData(data: ListData<T>): void {
    this.shape.staticData = data;
    this.loaderState.reset();
  }

  /** Pushes this render's data into the table. */
  public setData(data: T[]): void {
    this.currentData = data;
    this.listTable.setOptions(this.getTableOptions(data));
  }

  /** The query for one batch, as the data source asked to be asked. */
  public getDataLoaderOptions(batchIndex: number): ListDataLoaderOptions<T> {
    return getListDataLoaderOptions<T>(
      {
        batchSize: this.batches.batchSize,
        modes: this.loader,
        sorting: this.sorting,
        filters: this.filters,
        searchString: this.dataTable.getState().globalFilter as
          string | undefined,
      },
      batchIndex,
    );
  }

  /** Loads one batch and reports it, or reports that there is nothing to load. */
  public async loadBatch(batchIndex: number): Promise<void> {
    const { staticData, asyncLoader } = this.shape;

    const result: ListDataLoaderResult<T> | undefined = staticData
      ? { data: staticData, itemTotalCount: staticData.length }
      : asyncLoader
        ? await asyncLoader(this.getDataLoaderOptions(batchIndex))
        : { data: emptyData, itemTotalCount: 0 };

    this.loaderState.setDataBatch(batchIndex, result.data);
    this.loaderState.setMetadata(result.metadata);

    if (result.itemTotalCount !== undefined) {
      this.batches.updateItemTotalCount(result.itemTotalCount);
    }

    this.loaderState.setBatchLoadingState(batchIndex, "loaded");
  }

  private collectStaticDataProperties(): void {
    for (const entry of (this.shape.staticData ?? emptyData).slice(0, 100)) {
      if (typeof entry !== "object" || entry === null) {
        continue;
      }
      for (const property of Object.keys(entry) as PropertyName<T>[]) {
        if (!this.staticDataProperties.includes(property)) {
          this.staticDataProperties.push(property);
        }
      }
    }
  }

  private getTableOptions(data: readonly T[]): TableOptions<T> {
    const initialState: InitialTableState = {
      pagination: { pageSize: this.shape.batchSize ?? 20 },
      columnFilters: [],
    };

    for (const filter of this.filters) {
      filter.updateInitialState(initialState);
    }
    this.search?.updateInitialState(initialState);

    return {
      data: data as T[],
      state: { sorting: this.sortingState },
      getRowId: this.shape.getItemId,
      initialState,
      columns: this.getColumnDefs(),
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      onSortingChange: (updater) => {
        const next =
          typeof updater === "function" ? updater(this.sortingState) : updater;
        this.setSortingState(mergeHiddenSorting(this.sorting, next));
      },
      globalFilterFn: "auto",
      manualPagination: this.loader.manualPagination,
      manualFiltering: this.loader.manualFiltering,
      manualSorting: this.loader.manualSorting,
    } as TableOptions<T>;
  }

  private getColumnDefs(): ColumnDef<T>[] {
    const defs = new Map<PropertyName<T>, ColumnDef<T>>();

    const getOrCreate = (property: PropertyName<T>): ColumnDef<T> => {
      const existing = defs.get(property);
      if (existing) {
        return existing;
      }
      const def: ColumnDef<T> = {
        id: property as string,
        accessorKey: property as string,
        enableSorting: false,
        enableColumnFilter: false,
        sortingFn: "alphanumeric",
      } as ColumnDef<T>;
      defs.set(property, def);
      return def;
    };

    this.filters.forEach((f) =>
      f.updateTableColumnDef(getOrCreate(f.property)),
    );
    this.sorting.forEach((s) =>
      s.updateTableColumnDef(getOrCreate(s.property)),
    );
    this.staticDataProperties.forEach((p) => getOrCreate(p));

    return Array.from(defs.values());
  }
}
