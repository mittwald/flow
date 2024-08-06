import type { Filter } from "@/components/List/model/filter/Filter";
import { isShallowEqual } from "remeda";
import { hash } from "object-code";

export class FilterValue {
  private readonly filter: Filter<unknown, string, unknown>;
  public readonly value: unknown;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(filter: Filter<any, any, any>, value: unknown) {
    this.filter = filter;
    this.value = value;
  }

  public equals(otherValue: FilterValue) {
    return isShallowEqual(this.value, otherValue.value);
  }

  public get id() {
    return `${this.filter.property}@@${hash(this.value)}`;
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
