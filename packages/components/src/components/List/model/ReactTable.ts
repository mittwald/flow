import type {
  Column,
  ColumnDef,
  ColumnSort,
  Table,
  TableOptions,
  Updater,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type List from "@/components/List/model/List";
import invariant from "invariant";
import type { PropertyName } from "@/components/List/model/types";
import type { SearchValue } from "@/components/List/model/search/types";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export class ReactTable<T> {
  public readonly list: List<T>;
  public readonly table: Table<T>;
  public readonly sortingState: ColumnSort[];
  public readonly updateSortingState: Dispatch<SetStateAction<ColumnSort[]>>;

  private constructor(
    list: List<T>,
    tableOptions: Partial<TableOptions<T>> = {},
  ) {
    this.list = list;

    const defaultSorting = this.list.sorting.filter(
      (s) => s.defaultEnabled !== false,
    );

    const [sortingState, updateSortingState] = useState<ColumnSort[]>(
      defaultSorting.map((s) => s.getReactTableColumnSort()),
    );
    this.sortingState = sortingState;
    this.updateSortingState = updateSortingState;
    this.table = this.useReactTable(tableOptions);
  }

  public static useNew<T>(
    list: List<T>,
    tableOptions: Partial<TableOptions<T>> = {},
  ): ReactTable<T> {
    return new ReactTable<T>(list, tableOptions);
  }

  private useReactTable(tableOptions: Partial<TableOptions<T>> = {}): Table<T> {
    const data = this.list.loader.useData();

    const table = useReactTable({
      data,
      state: {
        sorting: this.sortingState,
      },
      initialState: {
        pagination: {
          pageSize: this.list.batches.batchSize,
        },
      },
      columns: this.getTableColumnDefs(),
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      onSortingChange: (updater) => {
        this.handleSortingStateUpdate(updater);
      },
      globalFilterFn: "auto",
      ...tableOptions,
    });

    return table;
  }

  private handleSortingStateUpdate(updater: Updater<ColumnSort[]>) {
    const newSortingState =
      typeof updater === "function" ? updater(this.sortingState) : updater;

    const additionalHiddenSorting = this.list.sorting
      .filter(
        (s) =>
          s.defaultEnabled === "hidden" &&
          !newSortingState.some((existing) => existing.id === s.property),
      )
      .map((s) => s.getReactTableColumnSort());

    this.updateSortingState([...additionalHiddenSorting, ...newSortingState]);
  }

  public get searchString(): SearchValue {
    return this.table.getState().globalFilter;
  }

  public getTableColumn(property: PropertyName<T>): Column<T> {
    const column = this.table.getColumn(property as string);
    invariant(!!column, `Column #${property} is not defined`);
    return column;
  }

  private getTableColumnDefs(): ColumnDef<T>[] {
    const columnDefsMap = new Map<PropertyName<T>, ColumnDef<T>>();

    const getOrCreateColumnDef = (p: PropertyName<T>): ColumnDef<T> => {
      const existing = columnDefsMap.get(p);
      if (existing) {
        return existing;
      }
      const newDef: ColumnDef<T> = {
        id: p as string,
        accessorKey: p as string,
        enableSorting: false,
        enableColumnFilter: false,
      };

      columnDefsMap.set(p, newDef);
      return newDef;
    };

    this.list.filters.forEach((f) =>
      f.updateTableColumnDef(getOrCreateColumnDef(f.property)),
    );

    this.list.sorting.forEach((s) =>
      s.updateTableColumnDef(getOrCreateColumnDef(s.property)),
    );

    return Array.from(columnDefsMap.values());
  }
}

export default ReactTable;
