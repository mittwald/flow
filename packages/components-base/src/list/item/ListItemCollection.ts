import type { ListModelContext } from "../ListModelContext";
import { ListItem } from "./ListItem";

/**
 * The items the list currently shows.
 *
 * Read from the table's row model on every access rather than kept: the rows
 * are what sorting, filtering and paging produce, so a stored copy would be a
 * second answer to the same question.
 */
export class ListItemCollection<T> {
  public readonly context: ListModelContext<T>;

  public constructor(context: ListModelContext<T>) {
    this.context = context;
  }

  public get entries(): ListItem<T>[] {
    return this.context.dataTable
      .getRowModel()
      .rows.map((r) => ListItem.fromRow(this, r));
  }
}
