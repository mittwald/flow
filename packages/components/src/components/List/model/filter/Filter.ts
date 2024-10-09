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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const equalsPropertyMatcher: FilterMatcher<any, never, never> = (
  filterValue,
  propertyValue,
) => filterValue === propertyValue;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stringCastRenderMethod: PropertyValueRenderMethod<any> = (value) =>
  String(value);

export class Filter<T, TProp extends PropertyName<T>, TMatchValue> {
  public static readonly settingsStorageSchema = z
    .record(z.array(z.unknown()))
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
  private readonly defaultSelectedValues?: FilterValue[];

  public constructor(list: List<T>, shape: FilterShape<T, TProp, TMatchValue>) {
    this.list = list;
    this.property = shape.property;
    this.mode = shape.mode ?? "one";
    this._values = shape.values?.map((v) => new FilterValue(this, v));
    this.matcher = shape.matcher ?? equalsPropertyMatcher;
    this.renderItem = shape.renderItem ?? stringCastRenderMethod;
    this.name = shape.name;

    this.defaultSelectedValues = shape.defaultSelected
      ? this.values.filter((v) =>
          shape.defaultSelected?.some((d) => d === v.value),
        )
      : undefined;
  }

  private getStoredDefaultSelectedValues() {
    const storedValues =
      this.list.getStoredFilterDefaultSettings()?.[String(this.property)];

    return storedValues
      ? this.values.filter((v) => storedValues.includes(v.id))
      : undefined;
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
    filterValue: FilterValue,
  ): boolean {
    if (filterValue === null) {
      return true;
    }

    const toArray = (val: FilterValue | FilterValue[]): FilterValue[] =>
      Array.isArray(val) ? val : [val];

    const predicate = (filterValue: FilterValue) =>
      this.matcher(filterValue.value as never, property as never);

    if (this.mode === "all") {
      return toArray(filterValue).every(predicate);
    } else if (this.mode === "some") {
      const filterArr = toArray(filterValue);
      return filterArr.length === 0 || filterArr.some(predicate);
    } else if (this.mode === "one") {
      return predicate(filterValue);
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
    ).map((v) => new FilterValue(this, v));
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
    const currentValue = this.getValue();
    return Array.isArray(currentValue)
      ? currentValue
      : currentValue === null
        ? []
        : [currentValue];
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
    const initialValues = (this.getInitialValues() ?? []).map((v) => v.value);

    return (
      currentValues.length !== initialValues.length ||
      difference(currentValues, initialValues).length > 0
    );
  }

  private getInitialValues() {
    return this.getStoredDefaultSelectedValues() ?? this.defaultSelectedValues;
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
