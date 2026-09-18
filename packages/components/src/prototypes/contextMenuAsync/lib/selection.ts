import type { Key } from "react-aria-components";

/**
 * Merges a selection change coming from a collection that only holds _part_ of
 * the option universe.
 *
 * **Measured, not assumed:** react-aria 1.20's `SelectionManager` already
 * carries over a selected key whose option is not in the rendered collection —
 * `AsyncOptionMenu.browser.test.tsx` passes with this function bypassed. So
 * this is not a workaround for a react-aria bug.
 *
 * It is kept for two reasons:
 *
 * - It makes "selection is independent of what is loaded" (issue #1851,
 *   challenges 1 and 2) an explicit, unit-tested invariant instead of a
 *   behaviour we inherit silently and could lose in a minor upgrade.
 * - Only the visible keys are allowed to change, which is what lets
 *   `resolveSelection` expand react-aria's `"all"` wildcard safely.
 */
export const mergeSelection = (args: {
  /** The selection before the change. */
  previous: ReadonlySet<Key>;
  /** What the collection reported. */
  next: ReadonlySet<Key>;
  /** The keys the collection actually rendered at the time of the change. */
  visibleKeys: ReadonlySet<Key>;
}): Set<Key> => {
  const { previous, next, visibleKeys } = args;

  const carriedOver = [...previous].filter((key) => !visibleKeys.has(key));
  const stillSelected = [...next].filter((key) => visibleKeys.has(key));

  return new Set([...carriedOver, ...stillSelected]);
};

/**
 * `"all"` is react-aria's wildcard selection. It means "every key in the
 * current collection", which for a partially loaded list is not a selection we
 * can carry across a filter change — so the prototype resolves it eagerly
 * against what is visible.
 */
export const resolveSelection = (
  selection: "all" | ReadonlySet<Key>,
  visibleKeys: ReadonlySet<Key>,
): ReadonlySet<Key> => (selection === "all" ? visibleKeys : selection);
