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
import z from "zod";
import { toArray } from "@/lib/array/toArray";

const equalsPropertyMatcher: FilterMatcher<unknown, never, never> = (
  filterValue,
  propertyValue,
) => filterValue === propertyValue;

const stringCastRenderMethod: PropertyValueRenderMethod<unknown> = (value) =>
  String(value);

interface InitialValuesOptions {
  includeAutosaved?: boolean;
  includeInitialProp?: boolean;
}

export class Filter<T, TProp extends PropertyName<T>, TMatchValue> {
  public static readonly settingsStorageSchema = z
    .record(z.string().or(z.symbol()), z.array(z.string()))
    .optional();

  private _values?: FilterValue[] | undefined;
  private _valuesFromTableState?: FilterValue[];
  public readonly list: List<T>;
  public readonly property: TProp;
  public readonly mode: FilterMode;
  public readonly matcher: FilterMatcher<T, never, never>;
  public readonly renderItem: PropertyValueRenderMethod<TMatchValue>;
  public readonly name?: string;
  public readonly autosave: boolean;
  private onFilterChangedCallbacks = new Set<FilterUpdatedCallback<T, TProp>>();
  private readonly defaultSelectedValues?: readonly NonNullable<TMatchValue>[];
  private readonly initialSelectedValues?: readonly NonNullable<TMatchValue>[];
  public readonly priority: "primary" | "secondary";
  private storageKey: string;

  public constructor(list: List<T>, shape: FilterShape<T, TProp, TMatchValue>) {
    this.list = list;
    this.property = shape.property;
    this.storageKey = String(shape.property);
    this.mode = shape.mode ?? "some";
    this._values = shape.values?.map((v) => FilterValue.create(this, v));
    this.matcher = shape.matcher ?? equalsPropertyMatcher;
    this.renderItem = shape.renderItem ?? stringCastRenderMethod;
    this.name = shape.name;
    this.priority = shape.priority ?? "primary";
    this.defaultSelectedValues = shape.defaultSelected;
    this.initialSelectedValues = shape.initialSelected;
    this.autosave = shape.autosave ?? false;
    if (shape.onChanged) {
      this.onFilterChangedCallbacks.add(shape.onChanged);
    }
  }

  private getStoredSelectedIds() {
    return this.list.getStoredFilterDefaultSettings()?.[this.storageKey];
  }

  private getAutosavedSelectedIds() {
    if (this.autosave) {
      return this.list.getAutosavedFilterSettings()?.[this.storageKey];
    }
  }

  public updateInitialState(initialState: InitialTableState) {
    const initialValues = this.getInitialValues({
      includeAutosaved: true,
      includeInitialProp: true,
    });

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
    this.onFilterChangedCallbacks.forEach((cb) =>
      cb(
        {
          property: this.property,
        },
        toArray(newValue).map((v) => v?.value),
      ),
    );
  }

  public hasChanged(): boolean {
    const currentValues = this.getArrayValue().map((v) => v.value);
    const autosavedValues =
      this.getInitialFilterValues()?.map((v) => v.value) ?? [];

    return (
      currentValues.length !== autosavedValues.length ||
      difference(currentValues, autosavedValues).length > 0
    );
  }

  private getInitialValues(options: InitialValuesOptions = {}) {
    const { includeAutosaved = false, includeInitialProp = false } = options;
    return (
      (includeInitialProp ? this.initialSelectedValues : undefined) ??
      (includeAutosaved ? this.getAutosavedSelectedIds() : undefined) ??
      this.getStoredSelectedIds() ??
      this.defaultSelectedValues
    );
  }

  private getInitialFilterValues(
    options: InitialValuesOptions = {},
  ): FilterValue[] {
    return (
      this.getInitialValues(options)?.map((v) => FilterValue.create(this, v)) ??
      []
    );
  }

  public resetValues(): void {
    let resetTo: FilterValue[] | FilterValue | null;

    const initialValues = this.getInitialValues({
      includeAutosaved: false,
      includeInitialProp: false,
    });

    if (initialValues) {
      resetTo = initialValues.map((v) => FilterValue.create(this, v));
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
    this.onFilterChangedCallbacks.add(cb);
  }
}
