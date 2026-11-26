import type {
  TableShape,
  TableSupportedComponentProps,
} from "@/components/List/model/table/types";
import type List from "@/components/List/model/List";
import { TableHeader } from "@/components/List/model/table/TableHeader";
import { TableBody } from "@/components/List/model/table/TableBody";
import { isShallowEqual } from "remeda";

export class Table<T> {
  public readonly list: List<T>;
  public readonly header: TableHeader<T>;
  public readonly body: TableBody<T>;
  public readonly componentProps: TableSupportedComponentProps;

  public constructor(list: List<T>, shape: TableShape<T> = {}) {
    // `children` holds the header and body elements, which arrive as `header`
    // and `body`.
    const { header, body, children: ignoredChildren, ...restProps } = shape;
    this.list = list;
    this.header = new TableHeader(this, header);
    this.body = new TableBody(this, body);
    this.componentProps = restProps;
  }

  /**
   * Whether `other` would render the table identically, rows aside. Like
   * `TableRow.rendersSameAs`, it only holds for rows that declare
   * `renderDependencies`. Props count by identity, one by one, including the
   * list's own.
   */
  public rendersSameAs(other?: Table<T>): boolean {
    return (
      !!other &&
      isShallowEqual(this.list.componentProps, other.list.componentProps) &&
      isShallowEqual(this.componentProps, other.componentProps) &&
      this.header.rendersSameAs(other.header) &&
      this.body.rendersSameAs(other.body)
    );
  }
}
