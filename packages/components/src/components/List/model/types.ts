import type { FilterShape } from "@/components/List/model/filter/types";
import type { ItemViewShape } from "@/components/List/model/item/ItemView";
import type List from "@/components/List/model/List";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";
import type { BatchesControllerShape } from "@/components/List/model/pagination/types";
import type { SearchShape } from "@/components/List/model/search/types";
import type { SortingShape } from "@/components/List/model/sorting/types";
import type { TableShape } from "@/components/List/model/table/types";
import type { ItemType } from "@/lib/types/array";
import type { MultipleSelection, SelectionBehavior } from "@react-types/shared";
import type { DeepKeys, DeepValue } from "@tanstack/react-table";
import type { ReactNode } from "react";

export const customPropertyPrefix = "$" as const;
export type CustomPropertyName = `${typeof customPropertyPrefix}${string}`;

export type PropertyName<T> = DeepKeys<T> | CustomPropertyName;
export type PropertyValue<T, TProp> = TProp extends CustomPropertyName
  ? T
  : DeepValue<T, TProp>;
export type PropertyValueRenderMethod<TMatcherValue> = (
  prop: NonNullable<ItemType<TMatcherValue>>,
) => ReactNode;

export type OnListChanged<T, TMeta = unknown> = (list: List<T, TMeta>) => void;

export interface ListSupportedComponentProps extends MultipleSelection {
  /** The ID of the element labelling the list. */
  "aria-labelledby"?: string;
  /** An accessible label for the list. */
  "aria-label"?: string;
  /**
   * Whether selecting an item replaces the current selection (`"replace"`) or
   * adds to it (`"toggle"`).
   */
  selectionBehavior?: SelectionBehavior;
}

export interface ListSettingsStorageDefaults {
  filters?: {
    autosave?: boolean;
    manualSave?: boolean;
  };

  sorting?: {
    autosave?: boolean;
  };

  viewMode?: {
    autosave?: boolean;
  };

  search?: {
    autosave?: boolean;
  };
}

export interface ListShape<
  T,
  TMeta = unknown,
> extends ListSupportedComponentProps {
  /**
   * The key the lists settings (view mode, search, filters, sorting) are
   * persisted under. Requires a `<SettingsProvider />` — without a key nothing
   * is persisted.
   */
  settingStorageKey?: string;

  loader?: IncrementalLoaderShape<T>;
  filters?: FilterShape<T, never, never>[];
  itemView?: ItemViewShape<T>;
  search?: SearchShape<T>;
  sorting?: SortingShape<T>[];
  batchesController?: BatchesControllerShape;
  table?: TableShape<T>;

  /** Called with the items data when the user activates a list item. */
  onAction?: ItemActionFn<T>;
  /**
   * Makes list items expandable. The expanded content is placed in `<Content
   * slot="bottom" />`.
   *
   * @default false
   */
  accordion?: boolean;
  infiniteScroll?: boolean;
  /**
   * The number of skeleton placeholder items rendered while data is loading.
   * Defaults to the lists batch size.
   */
  loadingItemsCount?: number;
  /**
   * Derives a stable ID from an items data. Used to deduplicate items across
   * loaded batches and as the row ID in the table view.
   */
  getItemId?: GetItemId<T>;
  /** Called with the list model whenever its state changes. */
  onChange?: OnListChanged<T, TMeta>;
  /**
   * The view mode the list starts in. A persisted view mode takes precedence.
   *
   * @default "list"
   */
  defaultViewMode?: ListViewMode;
  /** Defaults for how the lists settings are persisted. */
  settingsStorageDefaults?: ListSettingsStorageDefaults;

  /** The view rendered when a search or filter returns no results. */
  emptySearchResultView?: ReactNode;
  /** The view rendered when the list contains no items. */
  emptyView?: ReactNode;
}

export type PropertyRecord<T, TValue> = Partial<
  Record<PropertyName<T>, TValue>
>;

export interface ListSettingsStorageShape {
  storageKey: string;
}

export type ListViewMode = "table" | "list" | "tiles";
export type ItemActionFn<T> = (data: T) => void;
export type GetItemId<T> = (data: T) => string;

export type EmptyViewType = "search" | "list";
