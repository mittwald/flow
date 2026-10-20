import { ListSorting } from "@mittwald/flow-components-base";
import type { List } from "@/components/List/model/List";

/**
 * React's sorting: the shared one, plus the list it belongs to.
 *
 * A sorting only translates between the TanStack table and the settings store,
 * and both are frameworkless, so everything it does is `ListSorting` in
 * `@mittwald/flow-components-base`. What is left here is `list` — the shared
 * class calls its list `context` and types it as the model's port, while
 * React's API has always handed out the `List` itself.
 */
export class Sorting<T> extends ListSorting<T> {
  public get list(): List<T> {
    return this.context as List<T>;
  }
}

export default Sorting;
