import type { Column, ColumnDef, SortDirection } from "@tanstack/react-table";
import type List from "@/components/List/model/List";
import type { PropertyName } from "@/components/List/model/item/Item";
import type { SortingShape } from "@/components/List/model/sorting/types";

export class Sorting<T> {
  public readonly list: List<T>;
  public readonly property: PropertyName<T>;
  public readonly name?: string;

  public constructor(list: List<T>, shape: SortingShape<T>) {
    this.list = list;
    this.property = shape.property;
    this.name = shape.name;
  }

  public updateTableColumnDef(def: ColumnDef<T>): void {
    def.enableSorting = true;
  }

  public get direction(): SortDirection | false {
    return this.list.reactTable.getTableColumn(this.property).getIsSorted();
  }

  public getTableColumn(): Column<T> {
    return this.list.reactTable.getTableColumn(this.property);
  }
}
