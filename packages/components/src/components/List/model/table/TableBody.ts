import type { Table } from "@/components/List/model/table/Table";
import type {
  TableBodyShape,
  TableBodySupportedComponentProps,
} from "@/components/List/model/table/types";
import { TableRow } from "@/components/List/model/table/TableRow";
import { isShallowEqual } from "remeda";

export class TableBody<T> {
  public readonly table: Table<T>;
  public readonly componentProps: TableBodySupportedComponentProps;
  public readonly row: TableRow<T>;

  public constructor(table: Table<T>, shape: TableBodyShape<T> = {}) {
    // `children` holds the row element, which arrives as `row`.
    const { row, children: ignoredChildren, ...rest } = shape;
    this.table = table;
    this.row = new TableRow(this, row);
    this.componentProps = rest;
  }

  public rendersSameAs(other: TableBody<T>): boolean {
    return (
      isShallowEqual(this.componentProps, other.componentProps) &&
      this.row.rendersSameAs(other.row)
    );
  }
}
