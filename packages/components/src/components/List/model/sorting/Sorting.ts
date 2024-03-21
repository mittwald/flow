import { Column, ColumnDef, SortDirection } from "@tanstack/react-table";
import List from "@/components/List/model/List";
import { PropertyName } from "@/components/List/model/item/Item";
import { SortingShape } from "@/components/List/model/sorting/types";

export class Sorting<T> {
  public readonly list: List<T>;
  public readonly property: PropertyName<T>;

  public constructor(list: List<T>, shape: SortingShape<T>) {
    this.list = list;
    this.property = shape.property;
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
