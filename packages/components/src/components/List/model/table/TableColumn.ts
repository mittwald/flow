import type {
  TableColumnShape,
  TableColumnSupportedComponentProps,
} from "~/components/List/model/table/types";
import type { TableHeader } from "~/components/List/model/table/TableHeader";

export class TableColumn<T> {
  public readonly tableHeader: TableHeader<T>;
  public readonly componentProps: TableColumnSupportedComponentProps;

  public constructor(
    tableHeader: TableHeader<T>,
    shape: TableColumnShape = {},
  ) {
    this.tableHeader = tableHeader;
    this.componentProps = shape;
  }
}
