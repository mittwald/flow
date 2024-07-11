import type { ComponentType } from "react";
import type { RenderItemFn } from "@/components/List/model/item/types";

type Props<T> = {} & {
  children: RenderItemFn<T>;
};

export const ListItemView = <T>(ignoredProps: Props<T>) => null;

export const TypedListItemView = <T>() =>
  ListItemView as ComponentType<Props<T>>;
