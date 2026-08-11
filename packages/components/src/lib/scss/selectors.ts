export type SuffixFromPrefixedKeys<
  T extends Record<string, unknown>,
  Prefix extends string,
> = {
  [K in keyof T & string]: K extends `${Prefix}${infer S}` ? S : never;
}[keyof T & string];

export function prefixedStyleClassname<
  T extends Record<string, string>,
  Prefix extends string,
  S extends SuffixFromPrefixedKeys<T, Prefix>,
>(styles: T, prefix: Prefix, suffix: S): T[`${Prefix}${S}` & keyof T] {
  return styles[`${prefix}${suffix}` as `${Prefix}${S}` & keyof T];
}

/**
 * Look up a class name by a dynamic (runtime) key — a key that cannot be
 * statically narrowed to one of `styles`' keys (e.g. built from a number, a
 * `string`-typed prop, or a helper's return). Returns `undefined` when the key
 * is not a class, which `clsx` safely ignores — unlike an `as keyof` cast,
 * which lies about the result being present.
 */
export function styleClassname<T extends Record<string, string>>(
  styles: T,
  classname: string,
): string | undefined {
  return styles[classname];
}
