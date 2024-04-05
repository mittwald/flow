import type { ItemCollection } from "@/components/List/model/item/ItemCollection";
import type { ReactNode } from "react";
import { createElement } from "react";
import type { DeepKeys, Row } from "@tanstack/react-table";

import type { AnyData } from "@/components/List/model/item/types";

export type PropertyName<T> = DeepKeys<T>;

export type RenderItemFn<T> = (data: T) => ReactNode;

export class Item<T> {
  public readonly id: string;
  public readonly data: T;
  public readonly collection: ItemCollection<T>;

  public constructor(collection: ItemCollection<T>, id: string, data: T) {
    this.collection = collection;
    this.id = id;
    this.data = data;
  }

  public render(): ReactNode {
    const renderFn = this.collection.list.render ?? Item.fallbackRenderItemFn;
    return renderFn(this.data);
  }

  public static fromRow<T>(
    collection: ItemCollection<T>,
    row: Row<T>,
  ): Item<T> {
    return new Item(collection, row.id, row.original);
  }

  private static fallbackRenderItemFn: RenderItemFn<AnyData> = (item) =>
    createElement("pre", undefined, JSON.stringify(item));
}
