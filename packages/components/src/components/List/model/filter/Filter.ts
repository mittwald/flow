import type {
  Column,
  ColumnDef,
  ColumnFilter,
  InitialTableState,
} from "@tanstack/react-table";
import type List from "@/components/List/model/List";
import { getProperty } from "dot-prop";
import type {
  FilterMatcher,
  FilterMode,
  FilterShape,
  FilterUpdatedCallback,
} from "@/components/List/model/filter/types";
import type {
  PropertyName,
  PropertyValueRenderMethod,
} from "@/components/List/model/types";
import { customPropertyPrefix } from "@/components/List/model/types";
import { difference, unique } from "remeda";
import { FilterValue } from "@/components/List/model/filter/FilterValue";
import { toArray } from "@/lib/array/toArray";
import type { ListSettingsStoreOperationOptions } from "../ListSettingsStore";
import type { DateRange, RangeValue } from "react-aria-components";
import { dateRangeFilterFn } from "@/components/List/model/filter/dateRangeFilterFn";
import type { DateValue } from "@internationalized/date";
import {
  isDateRangeValue,
  type RangeCalendarProps,
} from "@/components/Calendar";

const equalsPropertyMatcher: FilterMatcher<unknown, never, never> = (
  filterValue,
  propertyValue,
) => filterValue === propertyValue;

const stringCastRenderMethod: PropertyValueRenderMethod<unknown> = (value) =>
  String(value);

export class Filter<T, TProp extends PropertyName<T>, TMatchValue> {
  private _values?: FilterValue[] | undefined;
  private _valuesFromTableState?: FilterValue[];
  public readonly list: List<T>;
  public readonly property: TProp;
  public readonly mode: FilterMode;
  public readonly matcher: FilterMatcher<T, never, never>;
  public readonly renderItem: PropertyValueRenderMethod<TMatchValue>;
  public readonly name?: string;
  public readonly autosave: boolean;
  public readonly manualSave: boolean;
  private onFilterChangeCallbacks = new Set<FilterUpdatedCallback>();
  private readonly defaultSelectedValues?: FilterValue[];
  public readonly priority: "primary" | "secondary";
  public readonly storageKey: string;
  public readonly dateRangeOptions?: RangeCalendarProps;

  public constructor(list: List<T>, shape: FilterShape<T, TProp, TMatchValue>) {
    const {
      autosave = list.settingsStorageDefaults?.filters?.autosave ?? false,
      manualSave = list.settingsStorageDefaults?.filters?.manualSave ?? true,
      property,
      mode = "some",
      values,
      matcher = equalsPropertyMatcher,
      renderItem = stringCastRenderMethod,
      priority = "primary",
      name,
      defaultSelected,
      dateRangeOptions,
      onChange,
    } = shape;

    this.list = list;
    this.autosave = autosave;
    this.manualSave = manualSave;
    this.property = property;
    this.storageKey = String(property);
    this.mode = mode;
    this._values = values?.map((v) => FilterValue.create(this, v));
    this.matcher = matcher;
    this.renderItem = renderItem;
    this.name = name;
    this.priority = priority;
    this.dateRangeOptions = dateRangeOptions;
    this.defaultSelectedValues = defaultSelected?.map((v) =>
      FilterValue.create(this, v),
    );
    if (onChange) {
      this.onFilterChangeCallbacks.add(onChange);
    }
  }

  public updateInitialState(initialState: InitialTableState) {
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

  private getInitialSelectedIds() {
    return (
      this.getStoredSelectedIds({
        autosave: this.autosave,
        manualSave: this.manualSave,
      }) ?? this.defaultSelectedValues?.map((v) => v.id)
    );
  }

  private getStoredSelectedIds(options: ListSettingsStoreOperationOptions) {
    return this.list.settingsStorage?.get("activeFilters", options)?.[
      this.storageKey
    ];
  }

  private getStoredSelectedValues(options: ListSettingsStoreOperationOptions) {
    return this.getStoredSelectedIds(options)
      ?.map((id) => this.values.find((v) => v.id === id))
      .filter((v): v is FilterValue => v !== undefined);
  }

  public static storeFilters<T>(
    list: List<T>,
    options: ListSettingsStoreOperationOptions,
  ) {
    const data = Object.fromEntries(
      list.filters.map((filter) => [
        filter.storageKey,
        filter.getArrayValue().map((v) => v.id),
      ]),
    );

    list.settingsStorage?.store("activeFilters", data, options);
  }

  public updateTableColumnDef(def: ColumnDef<T>, mode?: FilterMode): void {
    def.enableColumnFilter = true;
    def.filterFn =
      mode === "dateRange" ? dateRangeFilterFn : this.getReactTableFilterFn();
  }

  private getReactTableFilterFn(): ColumnDef<T>["filterFn"] {
    return (row, _, filterValue) => {
      const propertyAsString = this.property as string;

      const filterBy = propertyAsString.startsWith(customPropertyPrefix)
        ? row.original
        : getProperty(row.original, propertyAsString);

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

    const predicate = (filterValue: FilterValue) =>
      this.matcher(filterValue.value as never, property as never);

    const toFilterValue = (something: unknown) =>
      FilterValue.create(this, something);

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
    return this.list.reactTable.table
      .getState()
      .columnFilters.find((f) => f.id === this.property);
  }

  private getTableColumn(): Column<T> {
    return this.list.reactTable.getTableColumn(this.property);
  }

  public getValue(): unknown {
    return this.getTableColumnFilter()?.value ?? null;
  }

  public getDateRangeValue() {
    const value = this.getTableColumnFilter()?.value;

    return isDateRangeValue(value) ? (value as DateRange) : null;
  }

  private getValuesFromTableState() {
    return unique(
      Array.from(this.getTableColumn().getFacetedUniqueValues().keys())
        .flatMap((v) => v)
        .filter((v) => v !== undefined && v !== null),
    ).map((v) => FilterValue.create(this, v));
  }

  private checkIfValueIsUnknown(value: FilterValue) {
    const isKnown = this.values.some((v) => v.id === value.id);
    return !isKnown;
  }

  public deleteUnknownFilterValues() {
    if (this.values === this.valuesFromTableState) {
      return;
    }

    for (const currentValues of this.getArrayValue()) {
      if (this.checkIfValueIsUnknown(currentValues)) {
        this.deactivateValue(currentValues);
      }
    }
  }

  public get values(): FilterValue[] {
    return this._values ?? this.valuesFromTableState;
  }

  private get valuesFromTableState(): FilterValue[] {
    if (!this._valuesFromTableState) {
      this._valuesFromTableState = this.getValuesFromTableState();
    }
    return this._valuesFromTableState;
  }

  public getArrayValue(): FilterValue[] {
    const value = this.getValue();
    return value === null
      ? []
      : toArray(value).map((v) => FilterValue.create(this, v));
  }

  public isValueActive(value: FilterValue): boolean {
    return this.getArrayValue().some((v) => v.equals(value));
  }

  public isActive(): boolean {
    return this.getArrayValue().length > 0;
  }

  public deactivateValue(value: FilterValue): void {
    const currentValueAsArray = this.getArrayValue();

    let updatedValue: FilterValue[] | FilterValue | null;

    if (this.mode === "all" || this.mode === "some") {
      updatedValue = currentValueAsArray.filter((v) => !v.equals(value));
    } else {
      updatedValue = null;
    }

    this.list.reactTable
      .getTableColumn(this.property)
      .setFilterValue(updatedValue);

    this.callOnChangedHandlers(updatedValue);
  }

  private callOnChangedHandlers(
    newValue: FilterValue[] | FilterValue | null,
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
    return !!this.list.settingsStorage && this.manualSave;
  }

  public resetValues(): void {
    let resetTo: FilterValue[] | FilterValue | null;

    const storedValues =
      this.getStoredSelectedValues({ autosave: false }) ??
      this.defaultSelectedValues;

    if (storedValues) {
      resetTo = storedValues;
    } else {
      if (this.mode === "all" || this.mode === "some") {
        resetTo = [];
      } else {
        resetTo = null;
      }
    }

    this.list.reactTable.getTableColumn(this.property).setFilterValue(resetTo);
    this.callOnChangedHandlers(resetTo);
  }

  public clear(): void {
    this.list.reactTable.getTableColumn(this.property).setFilterValue(null);
    this.callOnChangedHandlers(null);
  }

  public setDateRangeValue(range: RangeValue<DateValue>) {
    this.list.reactTable.getTableColumn(this.property).setFilterValue(range);
  }

  public toggleValue(newValue: FilterValue): void {
    const currentValueAsArray = this.getArrayValue();

    let updatedValue: FilterValue[] | FilterValue | null;

    if (this.mode === "all" || this.mode === "some") {
      if (newValue.isActive) {
        updatedValue = currentValueAsArray.filter((v) => !v.equals(newValue));
      } else {
        updatedValue = [...currentValueAsArray, newValue];
      }
    } else {
      updatedValue = newValue.isActive ? null : newValue;
    }

    this.list.reactTable
      .getTableColumn(this.property)
      .setFilterValue(updatedValue);
    this.callOnChangedHandlers(updatedValue);
  }

  public onFilterUpdated(cb: () => unknown): void {
    this.onFilterChangeCallbacks.add(cb);
  }
}
