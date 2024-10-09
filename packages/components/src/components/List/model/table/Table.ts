import type {
  TableShape,
  TableSupportedComponentProps,
} from "@/components/List/model/table/types";
import type List from "@/components/List/model/List";
import { TableHeader } from "@/components/List/model/table/TableHeader";
import { TableBody } from "@/components/List/model/table/TableBody";

export class Table<T> {
  public readonly list: List<T>;
  public readonly header: TableHeader<T>;
  public readonly body: TableBody<T>;
  public readonly componentProps: TableSupportedComponentProps;

  public constructor(list: List<T>, shape: TableShape<T> = {}) {
    const { header, body, ...restProps } = shape;
    this.list = list;
    this.header = new TableHeader(this, header);
    this.body = new TableBody(this, body);
    this.componentProps = restProps;
  }
}
