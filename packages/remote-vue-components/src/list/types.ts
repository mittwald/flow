import type {
  ListAsyncDataLoader,
  ListData,
  ListFilterShape,
  ListSearchShape,
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

export interface VueListShape<T> extends ListDataSourceShape<T> {
  filters?: VueListFilterShape<T>[];
  sorting?: ListSortingShape<T>[];
  search?: ListSearchShape;
  itemView?: ListItemViewShape<T>;
  batchSize?: number;
  loadingItemsCount?: number;
  getItemId?: (data: T) => string;
  defaultViewMode?: ListViewModeValue;
  infiniteScroll?: boolean;
  onAction?: (data: T) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
