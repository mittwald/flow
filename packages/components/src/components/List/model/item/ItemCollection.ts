import type List from "@/components/List/model/List";
import { Item } from "@/components/List/model/item/Item";

export class ItemCollection<T> {
  public readonly list: List<T>;

  private constructor(list: List<T>) {
    this.list = list;
  }

  public static useNew<T>(list: List<T>): ItemCollection<T> {
    return new ItemCollection(list);
  }

  public get entries(): Item<T>[] {
    return this.list.reactTable.table
      .getRowModel()
      .rows.map((r) => Item.fromRow(this, r));
  }
}
