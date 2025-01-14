import type { ComponentType } from "react";
import type { RenderItemFn } from "~/components/List/model/item/types";
import type { ItemViewShape } from "~/components/List/model/item/ItemView";

type Props<T> = Omit<ItemViewShape<T>, "renderFn"> & {
  children: RenderItemFn<T>;
};

export const ListItem = <T>(ignoredProps: Props<T>) => null;

export const TypedListItem = <T>() => ListItem as ComponentType<Props<T>>;
