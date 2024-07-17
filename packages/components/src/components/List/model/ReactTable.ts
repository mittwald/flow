import type {
  Column,
  ColumnDef,
  Table,
  TableOptions,
  TableState,
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
import { useLocalObservable } from "mobx-react-lite";
import { runInAction } from "mobx";
import { useAutorunEffect } from "@/lib/mobx/useAutorunEffect";
import type { PropertyName } from "@/components/List/model/types";
import type { SearchValue } from "@/components/List/model/search/types";

export class ReactTable<T> {
  public readonly list: List<T>;
  public readonly table: Table<T>;
  private readonly tableState: { value: TableState | undefined };

  private constructor(
    list: List<T>,
    tableOptions: Partial<TableOptions<T>> = {},
  ) {
    this.list = list;
    this.tableState = useLocalObservable(() => ({ value: undefined }));
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

    const defaultSorting = this.list.sorting.filter((s) => s.defaultEnabled);

    const table = useReactTable({
      data,
      initialState: {
        pagination: {
          pageSize: this.list.batches.batchSize,
        },
        sorting: defaultSorting.map((s) => ({
          id: String(s.property),
          desc: s.direction === "desc",
        })),
      },
      columns: this.getTableColumnDefs(),
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      onStateChange: this.onTableStateChange,
      globalFilterFn: "auto",
      ...tableOptions,
    });

    this.useUpdateTableState(table);

    return table;
  }

  private useUpdateTableState(table: Table<T>): void {
    useAutorunEffect(() => {
      const state = this.tableState.value;

      if (state) {
        table.setOptions((opts) => ({
          ...opts,
          state,
        }));
      } else {
        this.tableState.value = table.getState();
      }
    });
  }

  private onTableStateChange = (updater: Updater<TableState>) => {
    const prevState = this.tableState.value;

    if (!prevState) {
      return;
    }

    const newState =
      typeof updater === "function" ? updater(prevState) : updater;

    runInAction(() => {
      this.tableState.value = this.getUpdatedTableState(prevState, newState);
    });
  };

  private getUpdatedTableState(
    prevState: TableState,
    newState: TableState,
  ): TableState {
    // for further customization (like fixed sorting)
    return newState;
  }

  public get searchString(): SearchValue {
    return this.tableState.value?.globalFilter;
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
