import { compare, lt, lte } from "semver";
import type { CatalogEntry } from "./entries.js";

/**
 * Oldest first — the order the changes shipped, which is the order to apply
 * them.
 */
export const sortBySince = (entries: CatalogEntry[]): CatalogEntry[] =>
  entries.toSorted(
    (a, b) => compare(a.since, b.since) || a.id.localeCompare(b.id),
  );

/**
 * The entries that a move from `current` to `target` calls for.
 *
 * The gate is the exact version, not a major/minor/patch granularity: a
 * revision keyword bounds the _target_, and the set falls out of that. So
 * `upgrade patch` — target = highest patch of the current minor — selects
 * exactly the entries of the active minor, and `upgrade minor` selects every
 * entry of the active major.
 */
export const selectEntries = (
  entries: CatalogEntry[],
  current: string,
  target: string,
): CatalogEntry[] =>
  sortBySince(
    entries.filter((entry): boolean => {
      // The explicit `: boolean` is what makes the `switch` exhaustive. Without
      // it TypeScript infers the return type, a missing case compiles clean, and
      // a future `MigrationKind` would be silently excluded from every upgrade —
      // never offered, never reported, no error anywhere.
      switch (entry.kind) {
        case "migration":
          return lt(current, entry.since) && lte(entry.since, target);
        // The old path still works, so there is no boundary to cross — only the
        // replacement has to exist in the target.
        case "deprecation":
          return lte(entry.since, target);
      }
    }),
  );
