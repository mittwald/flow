import type {
  TableColumnShape,
  TableColumnSupportedComponentProps,
} from "@/components/List/model/table/types";
import type { TableHeader } from "@/components/List/model/table/TableHeader";
import { isShallowEqual } from "remeda";

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

  public rendersSameAs(other: TableColumn<T>): boolean {
    return isShallowEqual(this.componentProps, other.componentProps);
  }
}
