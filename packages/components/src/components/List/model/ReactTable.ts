import type {
  Column,
  ColumnDef,
  ColumnSort,
  InitialTableState,
  Table,
  TableOptions,
  Updater,
} from "@tanstack/table-core";
import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/table-core";
import type List from "@/components/List/model/List";
import {
  getListColumn,
  ListTable,
  mergeHiddenSorting,
} from "@mittwald/flow-components-base";
import type {
  OnListChanged,
  PropertyName,
} from "@/components/List/model/types";
import type { SearchValue } from "@/components/List/model/search/types";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useEffectEvent, useState } from "react";
import { useStatic } from "@/lib/hooks/useStatic";
import useSelector from "@/lib/mobx/useSelector";
import { Filter } from "./filter/Filter";

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
      (s) => s.initialEnabled !== false,
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
    return getListColumn(this.table, property);
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

    const options: TableOptions<T> = {
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
    } as TableOptions<T>;

    /*
     * `useReactTable` in twenty lines of MobX, so the Vue binding runs the same
     * table. What React still owns: the instance has to outlive a render, the
     * options are rebuilt on every render, and a state change has to re-render.
     */
    const listTable = useStatic(() => new ListTable<T>(options));
    listTable.setOptions(options);
    useSelector(() => listTable.state);

    const table = listTable.table;

    const reactTableState = table.getState();

    const onFiltersChanged = useEffectEvent(() => {
      Filter.storeFilters(this.list, this.list.filters, { autosave: true });
    });

    const onStateChanged = useEffectEvent(() => {
      if (onChange) {
        onChange(this.list);
      }
    });

    useEffect(() => {
      onStateChanged();
    }, [reactTableState]);

    useEffect(() => {
      onFiltersChanged();
    }, [reactTableState.columnFilters]);

    return table;
  }

  private handleSortingStateUpdate(updater: Updater<ColumnSort[]>) {
    const newSortingState =
      typeof updater === "function" ? updater(this.sortingState) : updater;

    this.updateSortingState(
      mergeHiddenSorting(this.list.sorting, newSortingState),
    );
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
