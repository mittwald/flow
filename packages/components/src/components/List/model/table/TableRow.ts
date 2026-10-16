import type {
  TableRowShape,
  TableRowSupportedComponentProps,
} from "@/components/List/model/table/types";
import { TableCell } from "@/components/List/model/table/TableCell";
import type { TableBody } from "@/components/List/model/table/TableBody";
import {
  dependenciesAreEqual,
  shallowEqual,
} from "@/components/List/model/equality";
import type { DependencyList } from "react";

export class TableRow<T> {
  public readonly tableBody: TableBody<T>;
  public readonly cells: TableCell<T>[];
  public readonly componentProps: TableRowSupportedComponentProps;
  public readonly dependencies?: DependencyList;

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
   * instead of their identity. Rows without them always re-render.
   */
  public rendersSameAs(other?: TableRow<T>): boolean {
    return (
      !!other &&
      !!this.dependencies &&
      dependenciesAreEqual(this.dependencies, other.dependencies) &&
      shallowEqual(this.componentProps, other.componentProps) &&
      this.cells.length === other.cells.length &&
      this.cells.every((cell, index) => {
        const otherCell = other.cells[index];
        return (
          !!otherCell &&
          shallowEqual(cell.componentProps, otherCell.componentProps)
        );
      })
    );
  }
}
