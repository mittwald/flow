import type {
  TableCellShape,
  TableCellSupportedComponentProps,
} from "@/components/List/model/table/types";
import type { TableRow } from "@/components/List/model/table/TableRow";
import type { RenderItemFn } from "@/components/List";
import type { ReactElement } from "react";

export class TableCell<T> {
  public readonly row: TableRow<T>;
  public readonly renderFn?: RenderItemFn<T>;
  public readonly componentProps: TableCellSupportedComponentProps;
  loadingView?: ReactElement;

  public constructor(row: TableRow<T>, shape: TableCellShape<T> = {}) {
    // `children` is the render function, which arrives as `renderFn`.
    const {
      renderFn,
      loadingView,
      children: ignoredChildren,
      ...rest
    } = shape as TableCellShape<T> & { children?: unknown };
    this.row = row;
    this.renderFn = renderFn;
    this.componentProps = rest;
    this.loadingView = loadingView;
  }
}
