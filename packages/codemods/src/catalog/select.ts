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
 *
 * The lower bound (`current < since`) used to gate every `migration` entry, on
 * the assumption that a consumer already applied everything behind their
 * version. That is a guess, not a fact: nothing records which codemods a
 * project has run, and bumping a dependency is a separate act from running this
 * tool. For a `codemod` entry the guess buys nothing anyway — re-running an
 * applied codemod is a verified no-op: every `src/migrations/<id>/` directory
 * with a `transform.ts` is required to hold a `transform.test.ts` beside it
 * (`src/tests/transformCoverage.test.ts` enforces that), and that co-located
 * test is what actually runs the transform twice and asserts the second run
 * changes nothing. `detectCurrentVersion` already leans on the same fact when
 * it falls back to the lowest version a range allows, on the stated grounds
 * that too low can only pull in extra (idempotent) codemods. The lower bound
 * only earns its keep for the entries with no no-op: a manual or behaviour-only
 * migration a person has to read and judge.
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
          // A codemod is idempotent, so only the upper bound applies — see the
          // function comment. A manual or no-code-change migration has no
          // no-op equivalent, so the lower bound stays: it counts only when
          // the range actually crosses `since`.
          return entry.action === "codemod"
            ? lte(entry.since, target)
            : lt(current, entry.since) && lte(entry.since, target);
        // The old path still works, so there is no boundary to cross — only the
        // replacement has to exist in the target. When a deprecation ships a
        // codemod, this already agrees with the codemod branch above, so the
        // two never disagree on the same entry.
        case "deprecation":
          return lte(entry.since, target);
      }
    }),
  );

/**
 * How many manual (or no-code-change) migrations `selectEntries` hides because
 * they are behind `current` — released before the consumer's version, so
 * presumably already read and judged by a person. Unlike a codemod there is no
 * idempotent way to confirm that, so the lower bound stays for them (see
 * `selectEntries`) and they drop out of the selection once crossed.
 *
 * A helper rather than inlined in `list` and `upgrade`, which both need this
 * count: it names one bucket in one place, so the two commands cannot drift on
 * what "hidden" means.
 */
export const hiddenEarlierManualCount = (
  entries: CatalogEntry[],
  current: string,
): number =>
  entries.filter(
    (entry) =>
      entry.kind === "migration" &&
      entry.action !== "codemod" &&
      lte(entry.since, current),
  ).length;
