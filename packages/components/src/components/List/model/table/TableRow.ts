import type {
  TableRowShape,
  TableRowSupportedComponentProps,
} from "@/components/List/model/table/types";
import { TableCell } from "@/components/List/model/table/TableCell";
import type { TableBody } from "@/components/List/model/table/TableBody";

export class TableRow<T> {
  public readonly tableBody: TableBody<T>;
  public readonly cells: TableCell<T>[];
  public readonly componentProps: TableRowSupportedComponentProps;

  public constructor(tableBody: TableBody<T>, shape: TableRowShape<T> = {}) {
    const { cells = [], ...rest } = shape;
    this.tableBody = tableBody;
    this.cells = cells.map((cellShape) => new TableCell(this, cellShape));
    this.componentProps = rest;
  }
}
