import type { ListModelContext } from "../ListModelContext";
import type { ListSettingsPort } from "../settings/types";
import type { Column, Table } from "@tanstack/table-core";

export interface FakeColumn {
  id: string;
  sorted: false | "asc" | "desc";
  toggledWithoutMulti?: boolean;
}

export interface FakeContext<T> extends ListModelContext<T> {
  column: FakeColumn;
  globalFilter: string | undefined;
  stored: { key: string; value: unknown }[];
}

export interface FakeContextOptions {
  storedSorting?: { property: string | number; direction: "asc" | "desc" };
  storedSearch?: { value?: string };
}

/**
 * Just enough TanStack table for the shared model's tests.
 *
 * Cast rather than built: `Table` has dozens of members and the model touches
 * four of them, so a real one would make these tests about TanStack. What they
 * are about — that sorting and searching drive the table and the settings store
 * correctly — is what these fakes make visible.
 */
export const fakeContext = <T>(
  options: FakeContextOptions = {},
): FakeContext<T> => {
  const column: FakeColumn = { id: "name", sorted: false };
  const stored: { key: string; value: unknown }[] = [];

  const context: FakeContext<T> = {
    column,
    globalFilter: undefined,
    stored,

    get dataTable(): Table<T> {
      return {
        getColumn: (id: string) =>
          id === column.id
            ? ({
                id: column.id,
                getIsSorted: () => column.sorted,
                toggleSorting: (desc?: boolean, multi?: boolean) => {
                  column.sorted = desc ? "desc" : "asc";
                  column.toggledWithoutMulti = multi === false;
                },
                clearSorting: () => {
                  column.sorted = false;
                },
              } as unknown as Column<T>)
            : undefined,
        getState: () => ({ globalFilter: context.globalFilter }),
        setGlobalFilter: (value: string | undefined) => {
          context.globalFilter = value;
        },
      } as unknown as Table<T>;
    },

    settings: {
      get: ((key: string) =>
        key === "sorting"
          ? options.storedSorting
          : options.storedSearch) as ListSettingsPort["get"],
      store: ((key: string, value: unknown) => {
        stored.push({ key, value });
      }) as ListSettingsPort["store"],
    } as ListSettingsPort,
  };

  return context;
};
