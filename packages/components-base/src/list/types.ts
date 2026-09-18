import type { DeepKeys } from "@tanstack/table-core";

export const customPropertyPrefix = "$" as const;

/**
 * A column that is not a property of the item — a computed one, or one a filter
 * invents. Prefixed so it cannot collide with a real key.
 */
export type CustomPropertyName = `${typeof customPropertyPrefix}${string}`;

export type PropertyName<T> = DeepKeys<T> | CustomPropertyName;
