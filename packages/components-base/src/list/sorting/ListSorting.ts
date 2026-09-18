import { getListColumn, type ListModelContext } from "../ListModelContext";
import type { PropertyName } from "../types";
import type { ListSortingShape, SortingDefaultMode, SortingFn } from "./types";
import type {
  Column,
  ColumnDef,
  ColumnSort,
  SortDirection,
} from "@tanstack/table-core";

/**
 * One way a list can be sorted — a property, a direction, and whether it is on.
 *
 * Framework-free: the state lives in the TanStack table and the preference in
 * the settings store, and this only translates between them. Which is why it
 * could move here whole, unlike the loader, which had to leave its fetching
 * behind.
 */
export class ListSorting<T> {
  public readonly context: ListModelContext<T>;
  public readonly property: PropertyName<T>;
  public readonly name?: string;
  public readonly directionName?: string;
  public readonly direction: SortDirection;
  public readonly initialEnabled: SortingDefaultMode;
  public readonly customSortingFn?: SortingFn<T>;
  public readonly autosave: boolean;

  public constructor(context: ListModelContext<T>, shape: ListSortingShape<T>) {
    const {
      property,
      name,
      directionName,
      direction = "asc",
      customSortingFn,
      autosave = context.settingsDefaults?.sorting?.autosave ?? true,
    } = shape;

    this.autosave = autosave;
    this.context = context;
    this.property = property;
    this.name = name;
    this.directionName = directionName;
    this.direction = direction;
    this.customSortingFn = customSortingFn;
    this.initialEnabled = this.getInitialEnabled(shape);
  }

  private getInitialEnabled(shape: ListSortingShape<T>): SortingDefaultMode {
    if (shape.defaultEnabled === "hidden") {
      return "hidden";
    }

    const storedSorting = this.context.settings?.get("sorting", {
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
    return this.getTableColumn().getIsSorted() == this.direction;
  }

  public getTableColumn(): Column<T> {
    return getListColumn(this.context.dataTable, this.property);
  }

  public enable(): void {
    this.getTableColumn().toggleSorting(this.direction === "desc", false);

    this.context.settings?.store(
      "sorting",
      {
        property: this.property as string,
        direction: this.direction,
      },
      {
        autosave: this.autosave,
      },
    );
  }

  public clear(): void {
    this.getTableColumn().clearSorting();
  }

  public get id(): string {
    return `${this.getTableColumn().id}:${this.direction}`;
  }
}

export default ListSorting;
