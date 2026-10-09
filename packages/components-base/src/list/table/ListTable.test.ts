import { autorun } from "mobx";
import { expect, test, vi } from "vitest";
import { ListTable } from "./ListTable";
import { getCoreRowModel, getSortedRowModel } from "@tanstack/table-core";
import type { TableOptions } from "@tanstack/table-core";

interface Row {
  name: string;
}

const options = (
  data: Row[],
  overrides: Partial<TableOptions<Row>> = {},
): TableOptions<Row> =>
  ({
    data,
    columns: [{ id: "name", accessorKey: "name" }],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...overrides,
  }) as TableOptions<Row>;

test("builds a table that produces rows", () => {
  const listTable = new ListTable(options([{ name: "b" }, { name: "a" }]));

  expect(listTable.table.getRowModel().rows).toHaveLength(2);
});

test("keeps the table's own state, so the table stays usable uncontrolled", () => {
  const listTable = new ListTable(options([{ name: "b" }, { name: "a" }]));

  listTable.table.getColumn("name")?.toggleSorting(false);

  expect(listTable.state.sorting).toEqual([{ id: "name", desc: false }]);
  expect(
    listTable.table.getRowModel().rows.map((r) => r.original.name),
  ).toEqual(["a", "b"]);
});

test("the state is observable — that is the binding's whole subscription", () => {
  const listTable = new ListTable(options([{ name: "a" }]));
  const seen = vi.fn();

  const stop = autorun(() => seen(listTable.state.sorting));
  listTable.table.getColumn("name")?.toggleSorting(true);
  stop();

  expect(seen).toHaveBeenCalledTimes(2);
});

test("new options reach the table without losing the state", () => {
  const listTable = new ListTable(options([{ name: "b" }]));
  listTable.table.getColumn("name")?.toggleSorting(false);

  listTable.setOptions(options([{ name: "b" }, { name: "a" }]));

  expect(listTable.state.sorting).toEqual([{ id: "name", desc: false }]);
  expect(
    listTable.table.getRowModel().rows.map((r) => r.original.name),
  ).toEqual(["a", "b"]);
});

test("a controlled piece of state wins over the table's own", () => {
  const onSortingChange = vi.fn();
  const listTable = new ListTable(
    options([{ name: "b" }, { name: "a" }], {
      state: { sorting: [{ id: "name", desc: true }] },
      onSortingChange,
    }),
  );

  expect(
    listTable.table.getRowModel().rows.map((r) => r.original.name),
  ).toEqual(["b", "a"]);

  listTable.table.getColumn("name")?.toggleSorting(false);

  /* The owner is told; the table does not overrule what it was handed. */
  expect(onSortingChange).toHaveBeenCalled();
  expect(
    listTable.table.getRowModel().rows.map((r) => r.original.name),
  ).toEqual(["b", "a"]);
});
