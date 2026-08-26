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
