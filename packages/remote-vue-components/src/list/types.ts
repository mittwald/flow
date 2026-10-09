import type {
  ListAsyncDataLoader,
  ListData,
  ListDataLoaderOptions,
  ListDataLoaderResult,
  ListFilterShape,
  ListSearchShape,
  ListSettingsPort,
  ListSortingShape,
  ListViewModeValue,
  PropertyName,
} from "@mittwald/flow-components-base";
import type { MaybeRefOrGetter, VNodeChild } from "vue";

/** What a filter's value renders to here. */
export type ListRendered = VNodeChild;

export type VueListFilterShape<T> = ListFilterShape<
  T,
  PropertyName<T>,
  never,
  ListRendered
> & {
  /** Only for `mode: "dateRange"` — handed to the calendar. */
  dateRangeOptions?: Record<string, unknown>;
};

/**
 * A loader written as a composable.
 *
 * The counterpart of React's `ListLoaderHooks`, which is called during render
 * and may therefore use hooks. A composable has the same requirement and a
 * stricter one: it runs in `setup()`, once. So it is handed the query as a
 * **getter** rather than as a value — reading it inside a `computed`, a `watch`
 * or a query library's key subscribes to it, and a changed filter, sorting or
 * search reaches the loader without it being called again.
 *
 * What it returns may be a plain result, a ref or a getter; `undefined` means
 * "not there yet" and leaves the batch loading.
 */
export type ListComposableDataLoader<T> = (
  options: () => ListDataLoaderOptions<T>,
) => MaybeRefOrGetter<ListDataLoaderResult<T> | undefined>;

export interface ListDataSourceShape<T> {
  /** All the data, already loaded. Paged, filtered and sorted by the table. */
  staticData?: ListData<T>;
  /** Loads one batch. What it is asked for depends on the three flags below. */
  asyncLoader?: ListAsyncDataLoader<T>;
  /**
   * What the async loader reads besides the query — a route parameter, a
   * selected project. A change loads every batch again, like React's
   * `dependencies`.
   */
  dependencies?: readonly unknown[];
  /** Loads one batch with composables. One source per list: this or the above. */
  composableLoader?: ListComposableDataLoader<T>;
  manualPagination?: boolean;
  manualFiltering?: boolean;
  manualSorting?: boolean;
}

export interface ListItemViewShape<T> {
  render?: (data: T) => VNodeChild;
  textValue?: (data: T) => string;
  href?: (data: T) => string;
  target?: string;
  /** Whether this item starts expanded. Only read in accordion mode. */
  defaultExpanded?: (data: T) => boolean;
  showList?: boolean;
  showTiles?: boolean;
  tileMaxWidth?: number;
}

export interface ListTableCellShape<T> {
  render?: (data: T) => VNodeChild;
  props: Record<string, unknown>;
}

export interface ListTableColumnShape {
  props: Record<string, unknown>;
  /** The column's label, rendered as the element's children. */
  render?: () => VNodeChild;
}

export interface ListTableShape<T> {
  props: Record<string, unknown>;
  headerProps: Record<string, unknown>;
  bodyProps: Record<string, unknown>;
  rowProps: Record<string, unknown>;
  columns: ListTableColumnShape[];
  cells: ListTableCellShape<T>[];
}

/**
 * What the list hands straight to the grid list and the table.
 *
 * Selection is theirs, not the list's: the host's `ItemsGridList` and `Table`
 * own the keys, the keyboard and the checkboxes, and Flow's React list does
 * nothing with these either — it spreads them through.
 */
export interface ListSelectionProps {
  selectionMode?: "none" | "single" | "multiple";
  /** Whether selecting replaces the selection or adds to it. */
  selectionBehavior?: "toggle" | "replace";
  selectedKeys?: "all" | readonly (string | number)[];
  defaultSelectedKeys?: "all" | readonly (string | number)[];
  disabledKeys?: readonly (string | number)[];
  disallowEmptySelection?: boolean;
  onSelectionChange?: (keys: unknown) => void;
}

export interface VueListShape<T> extends ListDataSourceShape<T> {
  /** Passed on to the grid list and the table, untouched. */
  componentProps?: ListSelectionProps;
  /**
   * Makes the items expandable. What they expand to is the item's `Content
   * slot="bottom"`.
   */
  accordion?: boolean;
  /** The table view mode. Without columns there is no table to switch to. */
  table?: ListTableShape<T>;
  /** Where the view settings are persisted. Without it, nothing is. */
  settings?: ListSettingsPort;
  filters?: VueListFilterShape<T>[];
  sorting?: ListSortingShape<T>[];
  /** Plus React's `ListSearch` field props: `autoSubmit`, `autoFocus`. */
  search?: ListSearchShape & { autoSubmit?: boolean; autoFocus?: boolean };
  itemView?: ListItemViewShape<T>;
  batchSize?: number;
  loadingItemsCount?: number;
  getItemId?: (data: T) => string;
  defaultViewMode?: ListViewModeValue;
  onAction?: (data: T) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
