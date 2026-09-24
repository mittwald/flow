import { ListItemCollection } from "@mittwald/flow-components-base";
import type { List } from "@/components/List/model/List";

/**
 * React's item collection: `ListItemCollection` from
 * `@mittwald/flow-components-base`, plus `list` — see `Sorting` for why.
 */
export class ItemCollection<T> extends ListItemCollection<T> {
  public get list(): List<T> {
    return this.context as List<T>;
  }
}

export default ItemCollection;
