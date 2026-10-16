import type {
  TableRowShape,
  TableRowSupportedComponentProps,
} from "@/components/List/model/table/types";
import { TableCell } from "@/components/List/model/table/TableCell";
import type { TableBody } from "@/components/List/model/table/TableBody";
import type { DependencyList } from "react";
import { isShallowEqual } from "remeda";

export class TableRow<T> {
  public readonly tableBody: TableBody<T>;
  public readonly cells: TableCell<T>[];
  public readonly componentProps: TableRowSupportedComponentProps;
  public readonly dependencies?: DependencyList;
  private lastComparison?: { other: TableRow<T>; result: boolean };

  public constructor(tableBody: TableBody<T>, shape: TableRowShape<T> = {}) {
    // `children` holds the cell elements, which arrive as `cells`.
    const {
      cells = [],
      dependencies,
      children: ignoredChildren,
      ...rest
    } = shape;
    this.tableBody = tableBody;
    this.cells = cells.map((cellShape) => new TableCell(this, cellShape));
    this.componentProps = rest;
    this.dependencies = dependencies;
  }

  /**
   * Whether `other` would render a row identically. Only rows that declare
   * `dependencies` can tell, since the cells' render functions count by those
   * instead of their identity. Rows without them always re-render. Row and cell
   * props count by identity, one by one.
   *
   * Every row of a render shares one model, so the result is cached for the
   * last `other`.
   */
  public rendersSameAs(other?: TableRow<T>): boolean {
    if (!other) {
      return false;
    }
    if (this.lastComparison?.other !== other) {
      this.lastComparison = { other, result: this.compareWith(other) };
    }
    return this.lastComparison.result;
  }

  private compareWith(other: TableRow<T>): boolean {
    return (
      !!this.dependencies &&
      isShallowEqual(this.dependencies, other.dependencies) &&
      isShallowEqual(this.componentProps, other.componentProps) &&
      this.cells.length === other.cells.length &&
      this.cells.every((cell, index) => {
        const otherCell = other.cells[index];
        return (
          !!otherCell &&
          isShallowEqual(cell.componentProps, otherCell.componentProps)
        );
      })
    );
  }
}
