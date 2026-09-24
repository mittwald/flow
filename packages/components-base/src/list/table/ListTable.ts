import { action, makeObservable, observable } from "mobx";
import { createTable } from "@tanstack/table-core";
import type {
  RowData,
  Table,
  TableOptions,
  TableOptionsResolved,
  TableState,
  Updater,
} from "@tanstack/table-core";

/**
 * A TanStack table whose state is MobX.
 *
 * `useReactTable` is `createTable` plus a `useState` for the table's own state
 * and a `setOptions` on every render that folds that state back in. Only the
 * `useState` is React, and `@tanstack/vue-table` reimplements the same twenty
 * lines against Vue's reactivity — so the state lives here instead and each
 * binding brings its subscription.
 *
 * Options still arrive from the binding on every render, because that is where
 * they come from: the loaded data, the column definitions the list's filters
 * and sortings produce, a controlled piece of state. `setOptions` is therefore
 * called by the binding, and re-applied here whenever the state changes.
 */
export class ListTable<T extends RowData> {
  public readonly table: Table<T>;
  public state: TableState;
  /**
   * Bumped whenever the state _or_ the options changed.
   *
   * The row models are derived from both, and the options are plain data that
   * arrives from the binding — so a binding observing only `state` keeps
   * rendering the previous rows after new data was handed in. It is the one
   * signal that says "ask the table again".
   */
  public revision = 0;
  private options: TableOptions<T>;

  public constructor(options: TableOptions<T>) {
    const resolved: TableOptionsResolved<T> = {
      state: {},
      onStateChange: () => {
        // replaced by `applyOptions` below
      },
      renderFallbackValue: null,
      ...options,
    };

    this.table = createTable<T>(resolved);
    this.state = this.table.initialState;
    this.options = options;

    makeObservable(this, {
      state: observable.ref,
      revision: observable,
      setState: action.bound,
      setOptions: action.bound,
    });

    this.applyOptions();
  }

  public setState(updater: Updater<TableState>): void {
    this.state = typeof updater === "function" ? updater(this.state) : updater;
    this.applyOptions();
  }

  /** Called by the binding on every render, with that render's options. */
  public setOptions(options: TableOptions<T>): void {
    this.options = options;
    this.applyOptions();
  }

  private applyOptions(): void {
    const options = this.options;
    this.revision += 1;

    this.table.setOptions((prev) => ({
      ...prev,
      ...options,
      state: {
        ...this.state,
        ...options.state,
      },
      onStateChange: (updater) => {
        this.setState(updater);
        options.onStateChange?.(updater);
      },
    }));
  }
}
