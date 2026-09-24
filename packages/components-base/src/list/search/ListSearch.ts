import type { ListModelContext } from "../ListModelContext";
import type { ListSearchShape, SearchValue } from "./types";
import type { InitialTableState } from "@tanstack/table-core";

/**
 * The list's search term: where it starts, where it is kept, who to tell.
 *
 * The term itself lives in the table's global filter — this owns the initial
 * value, the persistence and the notification, none of which is a framework's
 * business. What a binding adds on top is how the field is _rendered_.
 */
export class ListSearch<T> {
  public readonly context: ListModelContext<T>;
  private readonly onUpdateCallbacks = new Set<() => unknown>();
  private readonly initialValue?: string;
  private readonly defaultValue?: string;
  private readonly autosave: boolean;

  public constructor(context: ListModelContext<T>, shape: ListSearchShape) {
    const {
      autosave = context.settingsDefaults?.search?.autosave ?? false,
      defaultValue,
    } = shape;

    this.autosave = autosave;
    this.context = context;
    this.defaultValue = defaultValue;
    this.initialValue = this.getInitialValue();
  }

  public get value(): SearchValue {
    return this.context.dataTable.getState().globalFilter as SearchValue;
  }

  public get isSet(): boolean {
    return this.value !== undefined;
  }

  private callOnUpdateCallbacks(): void {
    this.onUpdateCallbacks.forEach((cb) => cb());
  }

  private getInitialValue(): string | undefined {
    return (
      this.context.settings?.get("search", { autosave: this.autosave })
        ?.value ?? this.defaultValue
    );
  }

  public updateInitialState(initialState: InitialTableState): void {
    initialState.globalFilter = this.initialValue;
  }

  public setValue(value: SearchValue): void {
    const table = this.context.dataTable;

    if (value === undefined || value.trim() === "") {
      /*
       * Only when something was actually set: clearing an empty search would
       * otherwise reset the loader and refetch on every keystroke that leaves
       * the field empty.
       */
      if (table.getState().globalFilter) {
        table.setGlobalFilter(undefined);
        this.callOnUpdateCallbacks();
      }
    } else {
      table.setGlobalFilter(value);
      this.callOnUpdateCallbacks();
    }

    this.context.settings?.store(
      "search",
      { value },
      { autosave: this.autosave },
    );
  }

  public clear(): void {
    this.setValue(undefined);
  }

  public onUpdated(cb: () => unknown): void {
    this.onUpdateCallbacks.add(cb);
  }
}

export default ListSearch;
