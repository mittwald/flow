import type {
  RenderCellFn,
  TableCellShape,
  TableCellSupportedComponentProps,
} from "@/components/List/model/table/types";
import type { TableRow } from "@/components/List/model/table/TableRow";

export class TableCell<T> {
  public readonly row: TableRow<T>;
  public readonly renderFn?: RenderCellFn<T>;
  public readonly componentProps: TableCellSupportedComponentProps;

  public constructor(row: TableRow<T>, shape: TableCellShape<T> = {}) {
    const { renderFn, ...rest } = shape;
    this.row = row;
    this.renderFn = renderFn;
    this.componentProps = rest;
  }
}
