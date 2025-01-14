import type { ItemCollection } from "~/components/List/model/item/ItemCollection";
import type { Row } from "@tanstack/react-table";

export class Item<T> {
  public readonly id: string;
  public readonly data: T;
  public readonly collection: ItemCollection<T>;

  public constructor(collection: ItemCollection<T>, id: string, data: T) {
    this.collection = collection;
    this.id = id;
    this.data = data;
  }

  public static fromRow<T>(
    collection: ItemCollection<T>,
    row: Row<T>,
  ): Item<T> {
    return new Item(collection, row.id, row.original);
  }
}
