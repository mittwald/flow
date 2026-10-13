import type { ListFilter } from "./ListFilter";
import { hash } from "object-code";
import { isShallowEqual } from "remeda";

const idPrefix = "FilterValueId@@";

/**
 * One selectable value of a filter, and the identity it is stored under.
 *
 * The id is content-addressed — the property plus a hash of the value — so a
 * selection survives a reload without the values having to keep their order or
 * their index.
 */
export class ListFilterValue<TRendered = unknown> {
  public readonly filter: ListFilter<unknown, string, unknown, TRendered>;
  public readonly value: unknown;
  public readonly id: string;

  private constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter: ListFilter<any, any, any, TRendered>,
    value: unknown,
  ) {
    this.filter = filter;

    /* An id round-tripped through storage, rather than a value. */
    if (typeof value === "string" && value.startsWith(idPrefix)) {
      this.value = filter.values.find((v) => v.id === value)?.value;
      this.id = value;
    } else {
      this.value = value;
      this.id = `${idPrefix}${this.filter.property}@@${hash(this.value)}`;
    }
  }

  public static create<TRendered>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter: ListFilter<any, any, any, TRendered>,
    value: unknown,
  ): ListFilterValue<TRendered> {
    if (value instanceof ListFilterValue) {
      return value as ListFilterValue<TRendered>;
    }
    return new ListFilterValue<TRendered>(filter, value);
  }

  public equals(otherValue: ListFilterValue<TRendered>): boolean {
    return isShallowEqual(this.value, otherValue.value);
  }

  public get isActive(): boolean {
    return this.filter.isValueActive(this);
  }

  public render(): TRendered {
    return this.filter.renderItem(this.value as never);
  }

  public toggle(): void {
    this.filter.toggleValue(this);
  }

  public deactivate(): void {
    this.filter.deactivateValue(this);
  }
}

export default ListFilterValue;
