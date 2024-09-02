import type { DeepKeys, DeepValue } from "@tanstack/react-table";
import type { SortingShape } from "@/components/List/model/sorting/types";
import type { BatchesControllerShape } from "@/components/List/model/pagination/types";
import type { FilterShape } from "@/components/List/model/filter/types";
import type { IncrementalLoaderShape } from "@/components/List/model/loading/types";
import type { SearchShape } from "@/components/List/model/search/types";
import type { ItemViewShape } from "@/components/List/model/item/ItemView";
import type { ReactNode } from "react";
import type { ItemType } from "@/lib/types/array";
import type List from "@/components/List/model/List";
import type { TableShape } from "@/components/List/model/table/types";
import type { MultipleSelection, SelectionBehavior } from "@react-types/shared";

export const customPropertyPrefix = "$" as const;
export type CustomPropertyName = `${typeof customPropertyPrefix}${string}`;

export type PropertyName<T> = DeepKeys<T> | CustomPropertyName;
export type PropertyValue<T, TProp> = TProp extends CustomPropertyName
  ? T
  : DeepValue<T, TProp>;
export type PropertyValueRenderMethod<TMatcherValue> = (
  prop: NonNullable<ItemType<TMatcherValue>>,
) => ReactNode;

export type OnListChanged<T> = (list: List<T>) => void;

export interface ListSupportedComponentProps extends MultipleSelection {
  "aria-labelledby"?: string;
  "aria-label"?: string;
  selectionBehavior?: SelectionBehavior;
}

export interface ListShape<T> extends ListSupportedComponentProps {
  loader?: IncrementalLoaderShape<T>;
  filters?: FilterShape<T, never, never>[];
  itemView?: ItemViewShape<T>;
  search?: SearchShape<T>;
  sorting?: SortingShape<T>[];
  batchesController?: BatchesControllerShape;
  table?: TableShape<T>;

  onAction?: ItemActionFn<T>;
  getItemId?: GetItemId<T>;
  onChange?: OnListChanged<T>;
  defaultViewMode?: ListViewMode;
}

export type PropertyRecord<T, TValue> = Partial<
  Record<PropertyName<T>, TValue>
>;

export type ListViewMode = "table" | "list";
export type ItemActionFn<T> = (data: T) => void;
export type GetItemId<T> = (data: T) => string;
