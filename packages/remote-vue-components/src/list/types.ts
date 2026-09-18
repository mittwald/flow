import type {
  ListAsyncDataLoader,
  ListData,
  ListFilterShape,
  ListSearchShape,
  ListSettingsPort,
  ListSortingShape,
  ListViewModeValue,
  PropertyName,
} from "@mittwald/flow-components-base";
import type { VNodeChild } from "vue";

/** What a filter's value renders to here. */
export type ListRendered = VNodeChild;

export type VueListFilterShape<T> = ListFilterShape<
  T,
  PropertyName<T>,
  never,
  ListRendered
>;

export interface ListDataSourceShape<T> {
  /** All the data, already loaded. Paged, filtered and sorted by the table. */
  staticData?: ListData<T>;
  /** Loads one batch. What it is asked for depends on the three flags below. */
  asyncLoader?: ListAsyncDataLoader<T>;
  manualPagination?: boolean;
  manualFiltering?: boolean;
  manualSorting?: boolean;
}

export interface ListItemViewShape<T> {
  render?: (data: T) => VNodeChild;
  textValue?: (data: T) => string;
  href?: (data: T) => string;
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

export interface VueListShape<T> extends ListDataSourceShape<T> {
  /** The table view mode. Without columns there is no table to switch to. */
  table?: ListTableShape<T>;
  /** Where the view settings are persisted. Without it, nothing is. */
  settings?: ListSettingsPort;
  filters?: VueListFilterShape<T>[];
  sorting?: ListSortingShape<T>[];
  search?: ListSearchShape;
  itemView?: ListItemViewShape<T>;
  batchSize?: number;
  loadingItemsCount?: number;
  getItemId?: (data: T) => string;
  defaultViewMode?: ListViewModeValue;
  onAction?: (data: T) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
