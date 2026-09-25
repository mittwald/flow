import type { ListSettingsDefaults, ListSettingsPort } from "./settings/types";
import type { PropertyName } from "./types";
import type { Column, Table } from "@tanstack/table-core";

/**
 * What a shared list model may reach for.
 *
 * The narrow replacement for the `List` back-reference the model classes used
 * to carry: a `List` is a React object — its constructor calls hooks — while
 * what sorting and searching actually need is the TanStack table and the
 * persistence. A binding's own list satisfies this shape and keeps passing
 * itself.
 *
 * `dataTable`, not `table`: Flow's `List` already calls its own view model
 * `table`, and the TanStack instance is a different thing — the rows, the
 * sorting state and the global filter. It is a getter on purpose, because the
 * model is built before the table is and reading it eagerly reads `undefined`.
 */
export interface ListModelContext<T> {
  readonly dataTable: Table<T>;
  readonly settings?: ListSettingsPort;
  readonly settingsDefaults?: ListSettingsDefaults;
}

/**
 * The table's column for a property.
 *
 * Throws rather than returning `undefined`: a sorting or a filter names a
 * column the list declared, so a miss is a wiring mistake, and the alternative
 * is a control that silently does nothing.
 */
export const getListColumn = <T>(
  table: Table<T>,
  property: PropertyName<T>,
): Column<T> => {
  const column = table.getColumn(property as string);

  if (!column) {
    throw new Error(`Column #${String(property)} is not defined`);
  }

  return column;
};
