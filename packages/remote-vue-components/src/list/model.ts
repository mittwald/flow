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
import { hash } from "object-code";
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
import { DateRangeFilter } from "./dateRangeFilter";
import type { ListRendered, VueListShape } from "./types";

const emptyData: never[] = [];

/** The same items in the same order, whether or not it is the same array. */
const isSameData = <T>(
  current: ListData<T> | undefined,
  next: ListData<T>,
): boolean =>
  current === next ||
  (current !== undefined &&
    current.length === next.length &&
    current.every((item, index) => item === next[index]));

/*
 * What a render hands the model: the setup elements' props, which change when
 * the app's state does. Functions are left out — a Vue closure reads refs, so
 * a new one on every render is the same function, and comparing them would
 * rebuild the list on every render.
 */
const setupSignature = (value: unknown): string => String(hash(value));

const withoutFunctions = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(withoutFunctions)
    : typeof value === "object" && value !== null
      ? Object.fromEntries(
          Object.entries(value)
            .filter(([, entry]) => typeof entry !== "function")
            .map(([key, entry]) => [key, withoutFunctions(entry)]),
        )
      : value;

/** The parts of the shape a render can change after the list was built. */
export type ListSetupShape<T> = Pick<
  VueListShape<T>,
  "filters" | "sorting" | "search" | "asyncLoader" | "dependencies"
>;

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
  /*
   * Rebuilt when the app changes them, as React rebuilds them on every render.
   * Their state is not in them — it is the table's — so a rebuild keeps what
   * the user selected.
   */
  public filters: ListFilter<T, never, never, ListRendered>[] = [];
  public sorting: ListSorting<T>[] = [];
  public search?: ListSearch<T>;
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

  /**
   * The request each batch is waiting for. A newer request for the batch, or a
   * reset, makes an older one stale: its answer belongs to a query the list no
   * longer shows.
   */
  private readonly pendingLoads = new Map<number, object>();

  private setupSignatures: { setup: string; dependencies: string };

  public constructor(shape: VueListShape<T>) {
    this.shape = shape;

    this.loader = {
      manualPagination: shape.manualPagination ?? false,
      manualFiltering: shape.manualFiltering ?? shape.manualPagination ?? false,
      manualSorting: shape.manualSorting ?? shape.manualPagination ?? false,
    };

    this.loaderState = new ListLoaderState<T>({ getItemId: shape.getItemId });
    if (shape.staticData) {
      this.shape.staticData = [...shape.staticData];
    }
    this.collectStaticDataProperties();
    this.buildSetup();
    this.setupSignatures = this.signaturesOf(shape);

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

    this.wireSetup();
  }

  private buildSetup(): void {
    const { shape } = this;

    this.filters = (shape.filters ?? []).map((filterShape) =>
      filterShape.mode === "dateRange"
        ? (new DateRangeFilter<T>(this, filterShape) as unknown as ListFilter<
            T,
            never,
            never,
            ListRendered
          >)
        : new ListFilter<T, never, never, ListRendered>(
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
  }

  /* The list owns the filters, so the list wires what a change resets. */
  private wireSetup(): void {
    this.filters.forEach((f) =>
      f.onFilterUpdated(() => {
        this.batches.reset();
        this.resetLoaderState();
        ListFilter.storeFilters(this, this.filters, { autosave: true });
      }),
    );
    this.search?.onUpdated(() => {
      this.batches.reset();
      this.resetLoaderState();
    });
  }

  private signaturesOf(shape: ListSetupShape<T>) {
    return {
      setup: setupSignature(
        withoutFunctions([shape.filters, shape.sorting, shape.search]),
      ),
      dependencies: setupSignature(withoutFunctions(shape.dependencies ?? [])),
    };
  }

  /**
   * Takes what this render says about the filters, the sorting, the search and
   * the loader.
   *
   * Read once, a filter whose `values` load after the list was built would
   * offer nothing for good, and a loader reading a changed route would keep
   * answering for the old one. React reads all of it on every render; here it
   * is compared, and only a change rebuilds — a rebuild re-applies the table
   * options, which re-renders the list.
   */
  public updateSetup(shape: ListSetupShape<T>): void {
    const signatures = this.signaturesOf(shape);
    /* The latest closure, whether or not anything else changed. */
    this.shape.asyncLoader = shape.asyncLoader;

    const setupChanged = signatures.setup !== this.setupSignatures.setup;
    const dependenciesChanged =
      signatures.dependencies !== this.setupSignatures.dependencies;
    this.setupSignatures = signatures;

    if (setupChanged) {
      this.shape.filters = shape.filters;
      this.shape.sorting = shape.sorting;
      this.shape.search = shape.search;
      this.buildSetup();
      this.wireSetup();
      this.listTable.setOptions(this.getTableOptions(this.currentData));
      /* React runs this after every render that rebuilt its filters. */
      this.filters.forEach((filter) => filter.deleteUnknownFilterValues());
    }

    /*
     * React keys the loader's promise on its dependencies, so a change loads
     * every batch again.
     */
    if (dependenciesChanged) {
      this.shape.dependencies = shape.dependencies;
      this.resetLoaderState();
    }
  }

  private resetLoaderState(): void {
    this.pendingLoads.clear();
    this.loaderState.reset();
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
    /*
     * A source that sorts itself has to be asked again, the way React's loader
     * is — its promise is keyed on the query, and the query carries the
     * sorting. A composable is handed the query as a getter and follows it
     * without this.
     */
    if (this.loader.manualSorting && !this.hasComposableLoader) {
      this.resetLoaderState();
    }
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
   *
   * Compared by content, not by identity, because a consumer writes the array
   * inline — `h(ListStaticData, { data: [...] })` builds a new one on every
   * render. On identity that is always "changed", and the reset it triggers
   * re-renders the list, which builds the array again: Vue reports it as
   * "Maximum recursive updates exceeded in component <List>".
   */
  public setStaticData(data: ListData<T>): void {
    if (isSameData(this.shape.staticData, data)) {
      return;
    }

    /*
     * A copy, so an array the app changes in place — `items.value.push(…)` —
     * still compares as changed on the next render.
     */
    this.shape.staticData = [...data];
    /* React collects them from the data of every render. */
    this.staticDataProperties.length = 0;
    this.collectStaticDataProperties();
    this.resetLoaderState();
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

  /**
   * Whether a composable owns the batches.
   *
   * A composable cannot be called from a watcher — it needs a `setup()` — so
   * that source loads through a component per batch instead of `loadBatch`.
   */
  public get hasComposableLoader(): boolean {
    return this.shape.composableLoader !== undefined;
  }

  /**
   * Loads one batch and reports it, or reports that there is nothing to load.
   *
   * An answer that arrives after a newer request for the batch, or after a
   * reset, is dropped. A failure marks the batch `"error"` and rejects — the
   * list hands it to Vue's error handling, where React throws it into the error
   * boundary.
   */
  public async loadBatch(batchIndex: number): Promise<void> {
    const { staticData, asyncLoader } = this.shape;

    if (staticData || !asyncLoader) {
      this.reportBatch(
        batchIndex,
        staticData
          ? { data: staticData, itemTotalCount: staticData.length }
          : { data: emptyData, itemTotalCount: 0 },
      );
      return;
    }

    const request = {};
    this.pendingLoads.set(batchIndex, request);
    const isCurrent = () => this.pendingLoads.get(batchIndex) === request;

    let result: ListDataLoaderResult<T>;
    try {
      result = await asyncLoader(this.getDataLoaderOptions(batchIndex));
    } catch (error) {
      if (isCurrent()) {
        this.pendingLoads.delete(batchIndex);
        this.loaderState.setBatchLoadingState(batchIndex, "error");
        throw error;
      }
      return;
    }

    if (isCurrent()) {
      this.pendingLoads.delete(batchIndex);
      this.reportBatch(batchIndex, result);
    }
  }

  /**
   * Hands one batch's result to the shared state.
   *
   * Both loaders end here: the async one when its promise resolves, the
   * composable one when whatever it returned becomes defined.
   */
  public reportBatch(
    batchIndex: number,
    result: ListDataLoaderResult<T>,
  ): void {
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
