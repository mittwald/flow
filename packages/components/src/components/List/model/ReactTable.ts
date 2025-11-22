import type {
  Column,
  ColumnDef,
  ColumnSort,
  InitialTableState,
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
import type {
  OnListChanged,
  PropertyName,
} from "@/components/List/model/types";
import type { SearchValue } from "@/components/List/model/search/types";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

export class ReactTable<T, TMeta = unknown> {
  public readonly list: List<T, TMeta>;
  public readonly table: Table<T>;
  public readonly sortingState: ColumnSort[];
  public readonly updateSortingState: Dispatch<SetStateAction<ColumnSort[]>>;

  private constructor(
    list: List<T, TMeta>,
    onChange?: OnListChanged<T, TMeta>,
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
    this.table = this.useReactTable(onChange, tableOptions);
  }

  public get searchString(): SearchValue {
    return this.table.getState().globalFilter;
  }

  public static useNew<T, TMeta = unknown>(
    list: List<T, TMeta>,
    onChange?: OnListChanged<T, TMeta>,
    tableOptions: Partial<TableOptions<T>> = {},
  ): ReactTable<T, TMeta> {
    return new ReactTable<T, TMeta>(list, onChange, tableOptions);
  }

  public getTableColumn(property: PropertyName<T>): Column<T> {
    const column = this.table.getColumn(property as string);
    invariant(!!column, `Column #${property} is not defined`);
    return column;
  }

  private useReactTable(
    onChange?: OnListChanged<T, TMeta>,
    tableOptions: Partial<TableOptions<T>> = {},
  ): Table<T> {
    const data = this.list.loader.useData();

    const initialState: InitialTableState = {
      pagination: {
        pageSize: this.list.batches.batchSize,
      },
      columnFilters: [],
    };

    for (const filter of this.list.filters) {
      filter.updateInitialState(initialState);
    }

    this.list.search?.updateInitialState(initialState);

    const table = useReactTable({
      data,
      state: {
        sorting: this.sortingState,
      },
      getRowId: this.list.getItemId,
      initialState,
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

    useEffect(() => {
      if (onChange) {
        onChange(this.list);
      }
    }, [this.list, onChange, table]);

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
        sortingFn: "alphanumeric",
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

    this.list.loader.staticDataProperties.forEach((property) => {
      getOrCreateColumnDef(property);
    });

    return Array.from(columnDefsMap.values());
  }
}

export default ReactTable;
