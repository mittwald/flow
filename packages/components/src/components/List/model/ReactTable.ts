import { Signal, useSignal } from "@preact/signals-react";
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Table,
  TableOptions,
  TableState,
  Updater,
  useReactTable,
} from "@tanstack/react-table";
import { useSignals } from "@preact/signals-react/runtime";
import List from "@/components/List/model/List";
import { PropertyName } from "@/components/List/model/item/Item";
import invariant from "invariant";

export class ReactTable<T> {
  public readonly list: List<T>;
  public readonly table: Table<T>;
  private readonly tableState: Signal<TableState | undefined>;

  private constructor(
    list: List<T>,
    tableOptions: Partial<TableOptions<T>> = {},
  ) {
    this.list = list;
    this.tableState = useSignal(undefined);
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
      initialState: {
        pagination: {
          pageSize: this.list.pagination.initialPageSize,
        },
      },
      columns: this.getTableColumnDefs(),
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      onStateChange: this.onTableStateChange,
      ...tableOptions,
    });

    this.useUpdateTableState(table);

    return table;
  }

  private useUpdateTableState(table: Table<T>): void {
    useSignals();
    const state = this.tableState.value;

    if (state) {
      table.setOptions((opts) => ({
        ...opts,
        state,
      }));
    } else {
      this.tableState.value = table.getState();
    }
  }

  private onTableStateChange = (updater: Updater<TableState>) => {
    const prevState = this.tableState.value;

    if (!prevState) {
      return;
    }

    const newState =
      typeof updater === "function" ? updater(prevState) : updater;

    this.tableState.value = this.getUpdatedTableState(prevState, newState);
  };

  private getUpdatedTableState(
    prevState: TableState,
    newState: TableState,
  ): TableState {
    // for further customization (like fixed sorting)
    return newState;
  }

  public getTableColumn(property: PropertyName<T>): Column<T> {
    const column = this.table.getColumn(property as string);
    invariant(!!column, `Column #${property} is not defined`);
    return column;
  }

  private getTableColumnDefs(): Array<ColumnDef<T>> {
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
