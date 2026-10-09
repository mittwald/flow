import { ListItem } from "@mittwald/flow-components-base";
import type { ItemCollection } from "@/components/List/model/item/ItemCollection";

/**
 * `ListItem` from `@mittwald/flow-components-base`, with its collection typed
 * as React's — the one that carries `list`.
 */
export type Item<T> = ListItem<T> & { readonly collection: ItemCollection<T> };
export const Item = ListItem;
