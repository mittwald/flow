import type { Column, ColumnDef, SortDirection } from "@tanstack/react-table";
import type List from "@/components/List/model/List";
import type { SortingShape } from "@/components/List/model/sorting/types";
import type { PropertyName } from "@/components/List/model/types";

export class Sorting<T> {
  public readonly list: List<T>;
  public readonly property: PropertyName<T>;
  public readonly name?: string;
  public readonly direction: SortDirection;
  public readonly defaultEnabled: boolean;

  public constructor(list: List<T>, shape: SortingShape<T>) {
    this.list = list;
    this.property = shape.property;
    this.name = shape.name;
    this.direction = shape.direction ?? "asc";
    this.defaultEnabled = !!shape.defaultEnabled;
  }

  public updateTableColumnDef(def: ColumnDef<T>): void {
    def.enableSorting = true;
  }

  public isSorted(): boolean {
    const col = this.getTableColumn();
    return col.getIsSorted() == this.direction;
  }

  public getTableColumn(): Column<T> {
    return this.list.reactTable.getTableColumn(this.property);
  }

  public enable(): void {
    this.list.reactTable
      .getTableColumn(this.property)
      .toggleSorting(this.direction === "desc", false);
  }

  public clear(): void {
    this.list.reactTable.getTableColumn(this.property).clearSorting();
  }

  public get id(): string {
    return `${this.getTableColumn().id}:${this.direction}`;
  }
}
