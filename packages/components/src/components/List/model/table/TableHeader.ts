import type { Table } from "@/components/List/model/table/Table";
import type {
  TableHeaderShape,
  TableHeaderSupportedComponentProps,
} from "@/components/List/model/table/types";
import { TableColumn } from "@/components/List/model/table/TableColumn";
import { isShallowEqual } from "remeda";

export class TableHeader<T> {
  public readonly table: Table<T>;
  public readonly componentProps: TableHeaderSupportedComponentProps;
  public readonly columns: TableColumn<T>[];

  public constructor(table: Table<T>, shape: TableHeaderShape = {}) {
    // `children` holds the column elements, which arrive as `columns`.
    const { columns = [], children: ignoredChildren, ...rest } = shape;
    this.table = table;
    this.columns = columns.map((colShape) => new TableColumn(this, colShape));
    this.componentProps = rest;
  }

  public rendersSameAs(other: TableHeader<T>): boolean {
    return (
      isShallowEqual(this.componentProps, other.componentProps) &&
      this.columns.length === other.columns.length &&
      this.columns.every((column, index) => {
        const otherColumn = other.columns[index];
        return !!otherColumn && column.rendersSameAs(otherColumn);
      })
    );
  }
}
