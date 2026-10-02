import { ListItemCollection } from "@mittwald/flow-components-base";
import type { Item } from "@/components/List/model/item/Item";
import type { List } from "@/components/List/model/List";

/**
 * React's item collection: `ListItemCollection` from
 * `@mittwald/flow-components-base`, plus `list` — see `Sorting` for why.
 */
export class ItemCollection<T> extends ListItemCollection<T> {
  public get list(): List<T> {
    return this.context as List<T>;
  }

  /* Built with this collection, so each one's `collection` is React's. */
  public override get entries(): Item<T>[] {
    return super.entries as Item<T>[];
  }
}

export default ItemCollection;
