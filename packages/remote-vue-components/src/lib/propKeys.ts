import { camelize } from "vue";

/** `isRequired` → `is-required`, the way Vue's own `hyphenate` spells it. */
export const hyphenate = (key: string): string =>
  key.replace(/\B([A-Z])/g, "-$1").toLowerCase();

/**
 * A prop off a vnode, whichever way the template spelled it. A vnode carries
 * its props as written; Vue camelizes only when it resolves the props of the
 * component itself.
 */
export const readProp = (
  props: Record<string, unknown> | null | undefined,
  key: string,
): unknown => props?.[key] ?? props?.[hyphenate(key)];

/** Whether a key is kept dashed, the way Vue keeps `aria-*` and `data-*`. */
const keepsDashes = (key: string): boolean =>
  key.startsWith("aria-") || key.startsWith("data-");

/**
 * Whether a value is a boolean attribute written bare (`<X is-required>`),
 * which a template hands over as `""` — or as its own name, `is-required`.
 */
const isBareBoolean = (key: string, value: unknown): boolean =>
  value === "" || value === hyphenate(key);

/**
 * Props off a vnode, normalized the way Vue normalizes the props a component
 * declares: keys camelized (except `aria-*`/`data-*`), and a bare attribute
 * read as `true` where the key is a boolean. For components that read another
 * component's vnode instead of receiving the props themselves.
 */
export const normalizeVNodeProps = (
  props: Record<string, unknown> | null | undefined,
  booleanKeys: readonly string[] = [],
): Record<string, unknown> => {
  const normalized: Record<string, unknown> = {};

  for (const [rawKey, value] of Object.entries(props ?? {})) {
    const key = keepsDashes(rawKey) ? rawKey : camelize(rawKey);
    normalized[key] =
      booleanKeys.includes(key) && isBareBoolean(key, value) ? true : value;
  }

  return normalized;
};

/** A boolean prop off a vnode, whichever way the template spelled it. */
export const readBooleanProp = (
  props: Record<string, unknown> | null | undefined,
  key: string,
): unknown => {
  const value = readProp(props, key);
  return isBareBoolean(key, value) ? true : value;
};
