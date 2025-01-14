import type { Table } from "~/components/List/model/table/Table";
import type {
  TableHeaderShape,
  TableHeaderSupportedComponentProps,
} from "~/components/List/model/table/types";
import { TableColumn } from "~/components/List/model/table/TableColumn";

export class TableHeader<T> {
  public readonly table: Table<T>;
  public readonly componentProps: TableHeaderSupportedComponentProps;
  public readonly columns: TableColumn<T>[];

  public constructor(table: Table<T>, shape: TableHeaderShape = {}) {
    const { columns = [], ...rest } = shape;
    this.table = table;
    this.columns = columns.map((colShape) => new TableColumn(this, colShape));
    this.componentProps = rest;
  }
}
