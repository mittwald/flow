import type { Table } from "@/components/List/model/table/Table";
import type {
  TableBodyShape,
  TableBodySupportedComponentProps,
} from "@/components/List/model/table/types";
import { TableRow } from "@/components/List/model/table/TableRow";

export class TableBody<T> {
  public readonly table: Table<T>;
  public readonly componentProps: TableBodySupportedComponentProps;
  public readonly row: TableRow<T>;

  public constructor(table: Table<T>, shape: TableBodyShape<T> = {}) {
    const { row, ...rest } = shape;
    this.table = table;
    this.row = new TableRow(this, row);
    this.componentProps = rest;
  }
}
