import type { ItemCollection } from "@/components/List/model/item/ItemCollection";
import type { ReactNode } from "react";
import { createElement } from "react";
import type { Row } from "@tanstack/react-table";
import type { RenderItemFn } from "@/components/List/model/item/types";

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
    return renderFn(this.data as never);
  }

  public static fromRow<T>(
    collection: ItemCollection<T>,
    row: Row<T>,
  ): Item<T> {
    return new Item(collection, row.id, row.original);
  }

  private static fallbackRenderItemFn: RenderItemFn<never> = (item) =>
    createElement("pre", undefined, JSON.stringify(item));
}
