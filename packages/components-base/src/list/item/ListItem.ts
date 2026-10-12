import type { ListItemCollection } from "./ListItemCollection";
import type { Row } from "@tanstack/table-core";

/** One row of the list, as the views see it: an id and the data behind it. */
export class ListItem<T> {
  public readonly id: string;
  public readonly data: T;
  public readonly collection: ListItemCollection<T>;

  public constructor(collection: ListItemCollection<T>, id: string, data: T) {
    this.collection = collection;
    this.id = id;
    this.data = data;
  }

  public static fromRow<T>(
    collection: ListItemCollection<T>,
    row: Row<T>,
  ): ListItem<T> {
    return new ListItem(collection, row.id, row.original);
  }
}
