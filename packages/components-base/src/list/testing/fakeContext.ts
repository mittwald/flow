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
  columnFilters: { id: string; value: unknown }[];
  stored: { key: string; value: unknown }[];
}

export interface FakeContextOptions {
  storedSorting?: { property: string | number; direction: "asc" | "desc" };
  storedSearch?: { value?: string };
  storedActiveFilters?: Record<string, string[]>;
  /** What the table has seen in the data, for a filter without fixed values. */
  facetedValues?: unknown[];
  /** The map TanStack memoizes; takes precedence over `facetedValues`. */
  facets?: () => Map<unknown, number>;
  /** Beyond `name`, for a filter on another property. */
  columnIds?: string[];
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
  const knownIds = new Set(["name", ...(options.columnIds ?? [])]);

  const context: FakeContext<T> = {
    column,
    globalFilter: undefined,
    columnFilters: [],
    stored,

    get dataTable(): Table<T> {
      return {
        getColumn: (id: string) =>
          knownIds.has(id)
            ? ({
                id,
                getIsSorted: () => column.sorted,
                toggleSorting: (desc?: boolean, multi?: boolean) => {
                  column.sorted = desc ? "desc" : "asc";
                  column.toggledWithoutMulti = multi === false;
                },
                clearSorting: () => {
                  column.sorted = false;
                },
                setFilterValue: (value: unknown) => {
                  context.columnFilters = [
                    ...context.columnFilters.filter((f) => f.id !== id),
                    { id, value },
                  ];
                },
                getFacetedUniqueValues:
                  options.facets ??
                  (() =>
                    new Map((options.facetedValues ?? []).map((v) => [v, 1]))),
              } as unknown as Column<T>)
            : undefined,
        getState: () => ({
          globalFilter: context.globalFilter,
          columnFilters: context.columnFilters,
        }),
        setGlobalFilter: (value: string | undefined) => {
          context.globalFilter = value;
        },
      } as unknown as Table<T>;
    },

    settings: {
      get: ((key: string) => {
        if (key === "sorting") return options.storedSorting;
        if (key === "search") return options.storedSearch;
        return options.storedActiveFilters;
      }) as ListSettingsPort["get"],
      store: ((key: string, value: unknown) => {
        stored.push({ key, value });
      }) as ListSettingsPort["store"],
    } as ListSettingsPort,
  };

  return context;
};
