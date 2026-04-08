import type List from "@/components/List/model/List";
import type {
  SortingDefaultMode,
  SortingShape,
} from "@/components/List/model/sorting/types";
import type { PropertyName } from "@/components/List/model/types";
import type {
  Column,
  ColumnDef,
  ColumnSort,
  SortDirection,
  SortingFn,
} from "@tanstack/react-table";

export class Sorting<T> {
  public readonly list: List<T>;
  public readonly property: PropertyName<T>;
  public readonly name?: string;
  public readonly directionName?: string;
  public readonly direction: SortDirection;
  public readonly initialEnabled: SortingDefaultMode;
  public readonly customSortingFn?: SortingFn<T>;
  public readonly autosave: boolean;

  public constructor(list: List<T>, shape: SortingShape<T>) {
    const {
      property,
      name,
      directionName,
      direction = "asc",
      customSortingFn,
      autosave = list.settingsStorageDefaults?.sorting?.autosave ?? true,
    } = shape;

    this.autosave = autosave;
    this.list = list;
    this.property = property;
    this.name = name;
    this.directionName = directionName;
    this.direction = direction;
    this.customSortingFn = customSortingFn;
    this.initialEnabled = this.getInitialEnabled(shape);
  }

  private getInitialEnabled(shape: SortingShape<T>): SortingDefaultMode {
    if (shape.defaultEnabled === "hidden") {
      return "hidden";
    }

    const storedSorting = this.list.settingsStorage?.get("sorting", {
      autosave: this.autosave,
    });

    const storedEnabled = storedSorting
      ? storedSorting.property === this.property &&
        storedSorting.direction === this.direction
      : undefined;

    return storedEnabled ?? shape.defaultEnabled ?? false;
  }

  public updateTableColumnDef(def: ColumnDef<T>): void {
    def.enableSorting = true;
    if (this.customSortingFn) {
      def.sortingFn = this.customSortingFn;
    }
  }

  public getReactTableColumnSort(): ColumnSort {
    return {
      id: this.property as string,
      desc: this.direction === "desc",
    };
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

    this.list.settingsStorage?.store(
      "sorting",
      {
        property: this.property,
        direction: this.direction,
      },
      {
        autosave: this.autosave,
      },
    );
  }

  public clear(): void {
    this.list.reactTable.getTableColumn(this.property).clearSorting();
  }

  public get id(): string {
    return `${this.getTableColumn().id}:${this.direction}`;
  }
}
