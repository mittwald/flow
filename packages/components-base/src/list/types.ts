import type { ItemType } from "../lib/array";
import type { DeepKeys, DeepValue } from "@tanstack/table-core";

export const customPropertyPrefix = "$" as const;

/**
 * A column that is not a property of the item — a computed one, or one a filter
 * invents. Prefixed so it cannot collide with a real key.
 */
export type CustomPropertyName = `${typeof customPropertyPrefix}${string}`;

export type PropertyName<T> = DeepKeys<T> | CustomPropertyName;

export type PropertyValue<T, TProp> = TProp extends CustomPropertyName
  ? T
  : DeepValue<T, TProp>;

/**
 * How a filter turns one of its values into something to show.
 *
 * The return type is the binding's: React's `Filter` narrows it to `ReactNode`,
 * which is why the class carries it as a type parameter instead of deciding it
 * here.
 */
export type PropertyValueRenderMethod<TMatcherValue, TRendered = unknown> = (
  prop: NonNullable<ItemType<TMatcherValue>>,
) => TRendered;
