import type { Key } from "react-aria-components";

/**
 * The expansion state of an uncontrolled `AccordionGroup`. An accordion's own
 * `defaultExpanded` is only known once it renders, so the state stores what the
 * user changed instead of the full set of expanded keys.
 */
export interface Expansion {
  defaultKeys: ReadonlySet<Key>;
  overrides: ReadonlyMap<Key, boolean>;
  /** False once a single-expand toggle closed every accordion but one. */
  followsDefaults: boolean;
}

export const initialExpansion = (
  defaultExpandedKeys: Iterable<Key> = [],
): Expansion => ({
  defaultKeys: new Set(defaultExpandedKeys),
  overrides: new Map(),
  followsDefaults: true,
});

export const isKeyExpanded = (
  expansion: Expansion,
  key: Key,
  isDefaultExpanded: boolean,
): boolean =>
  expansion.overrides.get(key) ??
  (expansion.followsDefaults &&
    (isDefaultExpanded || expansion.defaultKeys.has(key)));

export const setKeyExpanded = (
  expansion: Expansion,
  key: Key,
  isExpanded: boolean,
  allowsMultipleExpanded: boolean,
): Expansion =>
  isExpanded && !allowsMultipleExpanded
    ? {
        ...expansion,
        overrides: new Map([[key, true]]),
        followsDefaults: false,
      }
    : {
        ...expansion,
        overrides: new Map(expansion.overrides).set(key, isExpanded),
      };

export const expandedKeysOf = (
  expansion: Expansion,
  defaultExpandedByKey: ReadonlyMap<Key, boolean>,
): Set<Key> =>
  new Set(
    [...defaultExpandedByKey].flatMap(([key, isDefaultExpanded]) =>
      isKeyExpanded(expansion, key, isDefaultExpanded) ? [key] : [],
    ),
  );

export const nextExpandedKeys = (
  expandedKeys: ReadonlySet<Key>,
  key: Key,
  isExpanded: boolean,
  allowsMultipleExpanded: boolean,
): Set<Key> => {
  if (isExpanded && !allowsMultipleExpanded) {
    return new Set([key]);
  }
  const next = new Set(expandedKeys);
  if (isExpanded) {
    next.add(key);
  } else {
    next.delete(key);
  }
  return next;
};
