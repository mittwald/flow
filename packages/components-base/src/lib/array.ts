/** One value or many, as many. */
export const toArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value];

/** The element type of an array, or the type itself when it is not one. */
export type ItemType<T> = T extends (infer TItem)[] ? TItem : T;
