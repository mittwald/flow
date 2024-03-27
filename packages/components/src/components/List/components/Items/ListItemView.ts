import { RenderItemFn } from "@/components/List/model/item/Item";

interface Props<T> {
  children: RenderItemFn<T>;
}

export function ListItemView<T = never>(ignoredProps: Props<T>) {
  return null;
}
