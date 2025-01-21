import type { Filter } from "@/components/List/model/filter/Filter";
import { isShallowEqual } from "remeda";
import { hash } from "object-code";

export class FilterValue {
  public readonly filter: Filter<unknown, string, unknown>;
  public readonly value: unknown;
  public readonly id: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private constructor(filter: Filter<any, any, any>, value: unknown) {
    this.filter = filter;

    if (typeof value === "string" && value.startsWith("FilterValueId@@")) {
      this.value = filter.values.find((v) => v.id === value)?.value;
      this.id = value;
    } else {
      this.value = value;
      this.id = `FilterValueId@@${this.filter.property}@@${hash(this.value)}`;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create(filter: Filter<any, any, any>, value: unknown) {
    if (value instanceof FilterValue) {
      return value;
    }
    return new FilterValue(filter, value);
  }

  public equals(otherValue: FilterValue) {
    return isShallowEqual(this.value, otherValue.value);
  }

  public get isActive() {
    return this.filter.isValueActive(this);
  }

  public render() {
    return this.filter.renderItem(this.value as never);
  }

  public toggle() {
    this.filter.toggleValue(this);
  }

  public deactivate() {
    this.filter.deactivateValue(this);
  }
}
