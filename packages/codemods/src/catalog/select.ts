import { lte } from "semver";
import type { CatalogEntry } from "./entries.js";
import { compareSince, isUnreleased } from "./unreleased.js";

/**
 * Oldest first — the order the changes shipped, which is the order to apply
 * them.
 */
export const sortBySince = (entries: CatalogEntry[]): CatalogEntry[] =>
  entries.toSorted(
    (a, b) => compareSince(a.since, b.since) || a.id.localeCompare(b.id),
  );

/**
 * The entries that a move to `target` calls for.
 *
 * The gate is the exact version, not a major/minor/patch granularity: a
 * revision keyword bounds `target`, and the set falls out of that. So `upgrade
 * patch` — target = highest patch of the current minor — selects exactly the
 * entries of the active minor, and `upgrade minor` selects every entry of the
 * active major.
 *
 * One rule, for every entry: `since <= target`. There used to be a second,
 * lower bound (`current < since`) for entries with no codemod, on the
 * assumption that a consumer already applied everything behind their version.
 * That was a guess, not a fact — nothing records which migrations a project has
 * performed — and it was wrong for the case this tool exists for: someone who
 * never ran it never did the manual steps either. Dropping it for codemods
 * (idempotent — see `transformCoverage.test.ts`) but keeping it for manual
 * entries only hid exactly the migrations that consumer needed to see. The
 * `catch-up` rendering in `src/cli/list.ts` now carries the distinction instead
 * of the gate hiding it.
 *
 * An entry still on the `UNRELEASED` placeholder is always in. There is no
 * version to compare it against, and the only catalogue that carries one is a
 * `next` prerelease of the very release the entry belongs to — previewing it is
 * the point of that channel (#2890).
 */
export const selectEntries = (
  entries: CatalogEntry[],
  target: string,
): CatalogEntry[] =>
  sortBySince(
    entries.filter(
      (entry) => isUnreleased(entry.since) || lte(entry.since, target),
    ),
  );
