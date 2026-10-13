/**
 * The expansion state of an uncontrolled `AccordionGroup`. An accordion's own
 * `defaultExpanded` is only known once it renders, so the state stores what the
 * user changed instead of the full set of expanded keys.
 */
export interface Expansion {
  defaultKeys: ReadonlySet<string>;
  overrides: ReadonlyMap<string, boolean>;
  /** False once a single-expand toggle closed every accordion but one. */
  followsDefaults: boolean;
}

export const initialExpansion = (
  defaultExpandedKeys: Iterable<string> = [],
): Expansion => ({
  defaultKeys: new Set(defaultExpandedKeys),
  overrides: new Map(),
  followsDefaults: true,
});

export const isKeyExpanded = (
  expansion: Expansion,
  key: string,
  isDefaultExpanded: boolean,
): boolean =>
  expansion.overrides.get(key) ??
  (expansion.followsDefaults &&
    (isDefaultExpanded || expansion.defaultKeys.has(key)));

export const setKeyExpanded = (
  expansion: Expansion,
  key: string,
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
  defaultExpandedByKey: ReadonlyMap<string, boolean>,
): Set<string> =>
  new Set(
    [...defaultExpandedByKey].flatMap(([key, isDefaultExpanded]) =>
      isKeyExpanded(expansion, key, isDefaultExpanded) ? [key] : [],
    ),
  );

export const nextExpandedKeys = (
  expandedKeys: ReadonlySet<string>,
  key: string,
  isExpanded: boolean,
  allowsMultipleExpanded: boolean,
): Set<string> => {
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
