import type { SearchShape } from "@/components/List/model/search/types";
import type { ListModelContext } from "@mittwald/flow-components-base";
import { ListSearch } from "@mittwald/flow-components-base";
import type { List } from "@/components/List/model/List";

/**
 * React's search: the shared one plus how the field is rendered.
 *
 * The term, its initial value and its persistence are `ListSearch` in
 * `@mittwald/flow-components-base`. `render` and `textFieldProps` stay here — a
 * component type and Flow's `SearchField` props are React, and a binding brings
 * its own.
 */
export class Search<T> extends ListSearch<T> {
  public readonly render?: SearchShape<T>["render"];
  public readonly textFieldProps: SearchShape<T>["textFieldProps"];

  public constructor(context: ListModelContext<T>, shape: SearchShape<T>) {
    super(context, shape);
    this.render = shape.render;
    this.textFieldProps = shape.textFieldProps;
  }

  /** The list this search belongs to — `context`, typed as React's `List`. */
  public get list(): List<T> {
    return this.context as List<T>;
  }
}
