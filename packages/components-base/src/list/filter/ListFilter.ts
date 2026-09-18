import { toArray } from "../../lib/array";
import { getListColumn, type ListModelContext } from "../ListModelContext";
import type { ListSettingsOperationOptions } from "../settings/types";
import { customPropertyPrefix } from "../types";
import type { PropertyName, PropertyValueRenderMethod } from "../types";
import { ListFilterValue } from "./ListFilterValue";
import type {
  FilterMatcher,
  FilterMode,
  FilterUpdatedCallback,
  ListFilterShape,
} from "./types";
import type {
  Column,
  ColumnDef,
  ColumnFilter,
  InitialTableState,
} from "@tanstack/table-core";
import { getProperty } from "dot-prop";
import { difference, unique } from "remeda";

const equalsPropertyMatcher: FilterMatcher<unknown, never, never> = (
  filterValue,
  propertyValue,
) => filterValue === propertyValue;

const stringCastRenderMethod: PropertyValueRenderMethod<unknown, never> = (
  value,
) => String(value) as never;

/** What `storeFilters` needs of a filter, and nothing more. */
interface StorableFilter {
  readonly storageKey: string;
  getArrayValue(): { id: string }[];
}

/**
 * One filter of a list: its values, which of them are on, and how that is
 * persisted.
 *
 * Framework-free apart from one thing, which is why `TRendered` exists: a
 * filter value has to be _shown_, and what "shown" is belongs to the binding.
 * React's `Filter` fills it with `ReactNode`; the default is `unknown`, so the
 * core can be read without deciding.
 *
 * The selected values live in the TanStack table's column filter, not here.
 * This translates: ids to values, values to a predicate, a toggle to a new
 * column filter.
 */
export class ListFilter<
  T = never,
  TProp extends PropertyName<T> = never,
  TMatchValue = never,
  TRendered = unknown,
> {
  private _values?: ListFilterValue<TRendered>[] | undefined;
  private _valuesFromTableState?: ListFilterValue<TRendered>[];
  public readonly context: ListModelContext<T>;
  public readonly property: TProp;
  public readonly mode: FilterMode;
  public readonly matcher: FilterMatcher<T, never, never>;
  public readonly renderItem: PropertyValueRenderMethod<TMatchValue, TRendered>;
  public readonly name?: string;
  public readonly autosave: boolean;
  public readonly manualSave: boolean;
  private readonly onFilterChangeCallbacks = new Set<FilterUpdatedCallback>();
  private readonly defaultSelectedValues?: ListFilterValue<TRendered>[];
  public readonly priority: "primary" | "secondary";
  public readonly storageKey: string;

  public constructor(
    context: ListModelContext<T>,
    shape: ListFilterShape<T, TProp, TMatchValue, TRendered>,
  ) {
    const {
      autosave = context.settingsDefaults?.filters?.autosave ?? false,
      manualSave = context.settingsDefaults?.filters?.manualSave ?? true,
      property,
      mode = "some",
      values,
      matcher = equalsPropertyMatcher,
      renderItem = stringCastRenderMethod as PropertyValueRenderMethod<
        TMatchValue,
        TRendered
      >,
      priority = "primary",
      name,
      defaultSelected,
      onChange,
    } = shape;

    this.context = context;
    this.autosave = autosave;
    this.manualSave = manualSave;
    this.property = property;
    this.storageKey = String(property);
    this.mode = mode;
    this._values = values?.map((v) => ListFilterValue.create(this, v));
    this.matcher = matcher;
    this.renderItem = renderItem;
    this.name = name;
    this.priority = priority;
    this.defaultSelectedValues = defaultSelected?.map((v) =>
      ListFilterValue.create(this, v),
    );
    if (onChange) {
      this.onFilterChangeCallbacks.add(onChange);
    }
  }

  public updateInitialState(initialState: InitialTableState): void {
    const initialIds = this.getInitialSelectedIds();

    if (initialIds?.length) {
      initialState.columnFilters = [
        ...(initialState.columnFilters ?? []),
        {
          id: this.property as string,
          value: initialIds,
        },
      ];
    }
  }

  private getInitialSelectedIds(): string[] | undefined {
    return (
      this.getStoredSelectedIds({
        autosave: this.autosave,
        manualSave: this.manualSave,
      }) ?? this.defaultSelectedValues?.map((v) => v.id)
    );
  }

  private getStoredSelectedIds(
    options: ListSettingsOperationOptions,
  ): string[] | undefined {
    return this.context.settings?.get("activeFilters", options)?.[
      this.storageKey
    ];
  }

  private getStoredSelectedValues(
    options: ListSettingsOperationOptions,
  ): ListFilterValue<TRendered>[] | undefined {
    return this.getStoredSelectedIds(options)
      ?.map((id) => this.values.find((v) => v.id === id))
      .filter((v): v is ListFilterValue<TRendered> => v !== undefined);
  }

  /**
   * Writes every filter's selection in one go — they share a settings key.
   *
   * Takes the two members it reads rather than a `ListFilter<any, …>`: a
   * `Table<never>` is not assignable to a `Table<any>` (a row model sits in a
   * contravariant position deep inside), so a list of concrete filters would
   * not go in.
   */
  public static storeFilters<T>(
    context: ListModelContext<T>,
    filters: StorableFilter[],
    options: ListSettingsOperationOptions,
  ): void {
    const data = Object.fromEntries(
      filters.map((filter) => [
        filter.storageKey,
        filter.getArrayValue().map((v) => v.id),
      ]),
    );

    context.settings?.store("activeFilters", data, options);
  }

  public updateTableColumnDef(def: ColumnDef<T>): void {
    def.enableColumnFilter = true;
    def.filterFn = this.getTableFilterFn();
  }

  private getTableFilterFn(): ColumnDef<T>["filterFn"] {
    return (row, _, filterValue) => {
      const propertyAsString = this.property as string;

      /*
       * A custom property is not on the item, so the matcher gets the item
       * itself and decides.
       */
      const filterBy = propertyAsString.startsWith(customPropertyPrefix)
        ? row.original
        : getProperty(row.original as object, propertyAsString);

      return this.checkFilterMatches(filterBy, filterValue);
    };
  }

  private checkFilterMatches(
    property: unknown,
    filterValueInput: unknown,
  ): boolean {
    if (filterValueInput === null) {
      return true;
    }

    const predicate = (filterValue: ListFilterValue<TRendered>) =>
      this.matcher(filterValue.value as never, property as never);

    const toFilterValue = (something: unknown) =>
      ListFilterValue.create(this, something);

    if (this.mode === "all") {
      return toArray(filterValueInput).map(toFilterValue).every(predicate);
    } else if (this.mode === "some") {
      const filterArr = toArray(filterValueInput);
      return (
        filterArr.length === 0 || filterArr.map(toFilterValue).some(predicate)
      );
    } else if (this.mode === "one") {
      const oneValue = Array.isArray(filterValueInput)
        ? filterValueInput[0]
        : filterValueInput;
      return predicate(toFilterValue(oneValue));
    }

    throw new Error(`Unknown filter mode '${this.mode}'`);
  }

  protected getTableColumnFilter(): ColumnFilter | undefined {
    return this.context.dataTable
      .getState()
      .columnFilters.find((f) => f.id === this.property);
  }

  protected getTableColumn(): Column<T> {
    return getListColumn(this.context.dataTable, this.property);
  }

  public getValue(): unknown {
    return this.getTableColumnFilter()?.value ?? null;
  }

  private getValuesFromTableState(): ListFilterValue<TRendered>[] {
    return unique(
      Array.from(this.getTableColumn().getFacetedUniqueValues().keys())
        .flatMap((v) => v)
        .filter((v) => v !== undefined && v !== null),
    ).map((v) => ListFilterValue.create(this, v));
  }

  private checkIfValueIsUnknown(value: ListFilterValue<TRendered>): boolean {
    return !this.values.some((v) => v.id === value.id);
  }

  /**
   * Drops a selection the data no longer offers — a stored filter value whose
   * item is gone would otherwise filter everything away with no way to undo
   * it.
   */
  public deleteUnknownFilterValues(): void {
    if (this.values === this.valuesFromTableState) {
      return;
    }

    for (const currentValues of this.getArrayValue()) {
      if (this.checkIfValueIsUnknown(currentValues)) {
        this.deactivateValue(currentValues);
      }
    }
  }

  public get values(): ListFilterValue<TRendered>[] {
    return this._values ?? this.valuesFromTableState;
  }

  private get valuesFromTableState(): ListFilterValue<TRendered>[] {
    if (!this._valuesFromTableState) {
      this._valuesFromTableState = this.getValuesFromTableState();
    }
    return this._valuesFromTableState;
  }

  public getArrayValue(): ListFilterValue<TRendered>[] {
    const value = this.getValue();
    return value === null
      ? []
      : toArray(value).map((v) => ListFilterValue.create(this, v));
  }

  public isValueActive(value: ListFilterValue<TRendered>): boolean {
    return this.getArrayValue().some((v) => v.equals(value));
  }

  public isActive(): boolean {
    return this.getArrayValue().length > 0;
  }

  public deactivateValue(value: ListFilterValue<TRendered>): void {
    const currentValueAsArray = this.getArrayValue();

    const updatedValue =
      this.mode === "all" || this.mode === "some"
        ? currentValueAsArray.filter((v) => !v.equals(value))
        : null;

    this.getTableColumn().setFilterValue(updatedValue);
    this.callOnChangedHandlers(updatedValue);
  }

  private callOnChangedHandlers(
    newValue: ListFilterValue<TRendered>[] | ListFilterValue<TRendered> | null,
  ): void {
    const values = toArray(newValue).map((v) => v?.value);
    this.onFilterChangeCallbacks.forEach((cb) => cb(values));
  }

  public hasChanges(): boolean {
    const currentIds = this.getArrayValue().map((v) => v.id);

    const defaultIds =
      this.getStoredSelectedIds({ autosave: false }) ??
      this.defaultSelectedValues?.map((v) => v.id) ??
      [];

    return (
      currentIds.length !== defaultIds.length ||
      difference(currentIds, defaultIds).length > 0
    );
  }

  public isStoringAvailable(): boolean {
    return !!this.context.settings && this.manualSave;
  }

  public resetValues(): void {
    const storedValues =
      this.getStoredSelectedValues({ autosave: false }) ??
      this.defaultSelectedValues;

    const resetTo =
      storedValues ?? (this.mode === "all" || this.mode === "some" ? [] : null);

    this.getTableColumn().setFilterValue(resetTo);
    this.callOnChangedHandlers(resetTo);
  }

  public clear(): void {
    this.getTableColumn().setFilterValue(null);
    this.callOnChangedHandlers(null);
  }

  public toggleValue(newValue: ListFilterValue<TRendered>): void {
    const currentValueAsArray = this.getArrayValue();

    let updatedValue:
      ListFilterValue<TRendered>[] | ListFilterValue<TRendered> | null;

    if (this.mode === "all" || this.mode === "some") {
      updatedValue = newValue.isActive
        ? currentValueAsArray.filter((v) => !v.equals(newValue))
        : [...currentValueAsArray, newValue];
    } else {
      updatedValue = newValue.isActive ? null : newValue;
    }

    this.getTableColumn().setFilterValue(updatedValue);
    this.callOnChangedHandlers(updatedValue);
  }

  public onFilterUpdated(cb: () => unknown): void {
    this.onFilterChangeCallbacks.add(cb);
  }
}

export default ListFilter;
