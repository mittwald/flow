import type { Column, ColumnDef, ColumnFilter } from "@tanstack/react-table";
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
import { isShallowEqual, unique } from "remeda";

const equalsPropertyMatcher: FilterMatcher<never, never, never> = (
  filterValue,
  propertyValue,
) => filterValue === propertyValue;

export class Filter<T, TProp extends PropertyName<T>, TMatchValue> {
  private _values?: unknown[] | undefined;
  public readonly list: List<T>;
  public readonly property: PropertyName<T>;
  public readonly mode: FilterMode;
  public readonly matcher: FilterMatcher<T, never, never>;
  public readonly renderItem: PropertyValueRenderMethod<TMatchValue>;
  public readonly name?: string;
  private onFilterUpdateCallbacks = new Set<() => unknown>();

  public constructor(list: List<T>, shape: FilterShape<T, TProp, TMatchValue>) {
    this.list = list;
    this.property = shape.property;
    this.mode = shape.mode ?? "one";
    this._values = shape.values;
    this.matcher =
      shape.matcher ??
      (equalsPropertyMatcher as FilterMatcher<T, never, never>);
    this.renderItem = shape.renderItem ?? ((v) => String(v));
    this.name = shape.name;
  }

  public updateTableColumnDef(def: ColumnDef<T>): void {
    def.enableColumnFilter = true;
    def.filterFn = this.getReactTableFilterFn();
  }

  private getReactTableFilterFn(): ColumnDef<T>["filterFn"] {
    return (row, _, filterValue) => {
      const propString = this.property as string;

      return this.checkFilterMatches(
        propString.startsWith(customPropertyPrefix)
          ? row.original
          : getProperty(row.original, propString),
        filterValue,
      );
    };
  }

  private checkFilterMatches(property: unknown, filterValue: unknown): boolean {
    if (filterValue === null) {
      return true;
    }

    const toArray = (val: unknown): unknown[] =>
      Array.isArray(val) ? val : [val];

    const predicate = (filterValue: unknown) =>
      this.matcher(filterValue as never, property as never);

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

  public getValueId(value: unknown): string {
    return `${this.property}@@${String(value)}`;
  }

  public get values(): unknown[] {
    if (this._values === undefined) {
      this._values = unique(
        Array.from(this.getTableColumn().getFacetedUniqueValues().keys())
          .flatMap((v) => v)
          .filter((v) => v !== undefined && v !== null),
      );
    }

    return this._values;
  }

  public getArrayValue(): unknown[] {
    const currentValue = this.getValue();
    return Array.isArray(currentValue)
      ? currentValue
      : currentValue === null
        ? []
        : [currentValue];
  }

  public isValueActive(value: unknown): boolean {
    return this.getArrayValue().some((v) => isShallowEqual(value, v));
  }

  public isActive(): boolean {
    return this.getArrayValue().length > 0;
  }

  public activateValue(newValue: unknown): void {
    const currentValueAsArray = this.getArrayValue();

    let updatedValue: unknown;

    if (this.mode === "all" || this.mode === "some") {
      updatedValue = [...currentValueAsArray, newValue];
    } else {
      updatedValue = newValue;
    }

    this.list.reactTable
      .getTableColumn(this.property)
      .setFilterValue(updatedValue);
    this.onFilterUpdateCallbacks.forEach((cb) => cb());
  }

  public deactivateValue(newValue: unknown): void {
    const currentValueAsArray = this.getArrayValue();

    let updatedValue: unknown;

    if (this.mode === "all" || this.mode === "some") {
      updatedValue = currentValueAsArray.filter((v) => v !== newValue);
    } else {
      updatedValue = null;
    }

    this.list.reactTable
      .getTableColumn(this.property)
      .setFilterValue(updatedValue);
    this.onFilterUpdateCallbacks.forEach((cb) => cb());
  }

  public clearValues(): void {
    let updatedValue: unknown;

    if (this.mode === "all" || this.mode === "some") {
      updatedValue = [];
    } else {
      updatedValue = null;
    }

    this.list.reactTable
      .getTableColumn(this.property)
      .setFilterValue(updatedValue);
    this.onFilterUpdateCallbacks.forEach((cb) => cb());
  }

  public toggleValue(newValue: unknown): void {
    const isActive = this.isValueActive(newValue);
    const currentValueAsArray = this.getArrayValue();

    let updatedValue: unknown;

    if (this.mode === "all" || this.mode === "some") {
      if (isActive) {
        updatedValue = currentValueAsArray.filter(
          (v) => !isShallowEqual(v, newValue),
        );
      } else {
        updatedValue = [...currentValueAsArray, newValue];
      }
    } else {
      updatedValue = isActive ? null : newValue;
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
