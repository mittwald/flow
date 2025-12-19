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
} from "@/components/List/model/filter/types";
import type {
  PropertyName,
  PropertyValueRenderMethod,
} from "@/components/List/model/types";
import { customPropertyPrefix } from "@/components/List/model/types";
import { difference, unique } from "remeda";
import { FilterValue } from "@/components/List/model/filter/FilterValue";
import z from "zod";
import { toArray } from "@/lib/array/toArray";

const equalsPropertyMatcher: FilterMatcher<unknown, never, never> = (
  filterValue,
  propertyValue,
) => filterValue === propertyValue;

const stringCastRenderMethod: PropertyValueRenderMethod<unknown> = (value) =>
  String(value);

export class Filter<T, TProp extends PropertyName<T>, TMatchValue> {
  public static readonly settingsStorageSchema = z
    .record(z.string().or(z.symbol()), z.array(z.string()))
    .optional();

  private _values?: FilterValue[] | undefined;
  private _valuesFromTableState?: FilterValue[];
  public readonly list: List<T>;
  public readonly property: PropertyName<T>;
  public readonly mode: FilterMode;
  public readonly matcher: FilterMatcher<T, never, never>;
  public readonly renderItem: PropertyValueRenderMethod<TMatchValue>;
  public readonly name?: string;
  private onFilterUpdateCallbacks = new Set<() => unknown>();
  private readonly defaultSelectedValues?: readonly NonNullable<TMatchValue>[];

  public constructor(list: List<T>, shape: FilterShape<T, TProp, TMatchValue>) {
    this.list = list;
    this.property = shape.property;
    this.mode = shape.mode ?? "some";
    this._values = shape.values?.map((v) => FilterValue.create(this, v));
    this.matcher = shape.matcher ?? equalsPropertyMatcher;
    this.renderItem = shape.renderItem ?? stringCastRenderMethod;
    this.name = shape.name;

    this.defaultSelectedValues = shape.defaultSelected;
  }

  private getStoredSelectedIds() {
    return this.list.getStoredFilterDefaultSettings()?.[String(this.property)];
  }

  public updateInitialState(initialState: InitialTableState) {
    const initialValues = this.getInitialValues();

    if (initialValues?.length) {
      initialState.columnFilters = [
        ...(initialState.columnFilters ?? []),
        {
          id: this.property as string,
          value: initialValues,
        },
      ];
    }
  }

  public updateTableColumnDef(def: ColumnDef<T>): void {
    def.enableColumnFilter = true;
    def.filterFn = this.getReactTableFilterFn();
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
      return predicate(toFilterValue(filterValueInput));
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

    let updatedValue: unknown;

    if (this.mode === "all" || this.mode === "some") {
      updatedValue = currentValueAsArray.filter((v) => !v.equals(value));
    } else {
      updatedValue = null;
    }

    this.list.reactTable
      .getTableColumn(this.property)
      .setFilterValue(updatedValue);
    this.onFilterUpdateCallbacks.forEach((cb) => cb());
  }

  public hasChanged(): boolean {
    const currentValues = this.getArrayValue().map((v) => v.value);
    const initialValues =
      this.getInitialFilterValues()?.map((v) => v.value) ?? [];

    return (
      currentValues.length !== initialValues.length ||
      difference(currentValues, initialValues).length > 0
    );
  }

  private getInitialValues() {
    return this.getStoredSelectedIds() ?? this.defaultSelectedValues;
  }

  private getInitialFilterValues() {
    return this.getInitialValues()?.map((v) => FilterValue.create(this, v));
  }

  public resetValues(): void {
    let resetTo: unknown;
    const initialValues = this.getInitialValues();

    if (initialValues) {
      resetTo = initialValues;
    } else {
      if (this.mode === "all" || this.mode === "some") {
        resetTo = [];
      } else {
        resetTo = null;
      }
    }

    this.list.reactTable.getTableColumn(this.property).setFilterValue(resetTo);
    this.onFilterUpdateCallbacks.forEach((cb) => cb());
  }

  public clear(): void {
    this.list.reactTable.getTableColumn(this.property).setFilterValue(null);
    this.onFilterUpdateCallbacks.forEach((cb) => cb());
  }

  public toggleValue(newValue: FilterValue): void {
    const currentValueAsArray = this.getArrayValue();

    let updatedValue: unknown;

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
    this.onFilterUpdateCallbacks.forEach((cb) => cb());
  }

  public onFilterUpdated(cb: () => unknown): void {
    this.onFilterUpdateCallbacks.add(cb);
  }
}
