import semver from "semver";

/**
 * Reused e2e entries whose remote-rendered host HTML legitimately DIFFERS
 * between an old version and current because the component's output structure
 * evolved — not because an old extension is broken. A strict HTML-equality
 * comparison would flag these, so they are excluded here — but only for the old
 * versions actually affected (`maxAffectedVersion`), so newer versions in range
 * still get real coverage.
 *
 * This is the entry-level analogue of `cross-version.exclude.json` (which
 * excludes whole broken published versions). Remove an entry once the tested
 * version range no longer includes an affected version.
 */
export interface ExcludedEntry {
  /** Entry file, as the host test derives it: leading-slash, no `../tests`. */
  entryFile: string;
  exportName: string;
  /**
   * Highest published version affected by the divergence. The entry is skipped
   * only for versions `<=` this; versions above it still run (the divergence
   * was resolved by then).
   */
  maxAffectedVersion: string;
  reason: string;
}

export const excludedEntries: ExcludedEntry[] = [
  {
    entryFile: "/Modal.browser.test.remote.tsx",
    exportName: "inList",
    maxAffectedVersion: "0.2.0-alpha.791",
    reason:
      "List gained an always-present, visually-hidden empty-view wrapper between alpha.791 and alpha.883. Versions <= alpha.791 render List without it, so the host HTML differs; alpha.883+ match current. A structural evolution of List, not a backwards-compat break.",
  },
];

/**
 * Whether an entry is excluded for the given tested version. Only versions at
 * or below an entry's `maxAffectedVersion` are excluded. A non-semver version
 * (e.g. the `current` sentinel, or unset) is never excluded.
 */
export const isExcludedEntry = (
  entryFile: string,
  exportName: string,
  version: string,
): boolean => {
  if (semver.valid(version) === null) {
    return false;
  }
  return excludedEntries.some(
    (excluded) =>
      excluded.entryFile === entryFile &&
      excluded.exportName === exportName &&
      semver.lte(version, excluded.maxAffectedVersion),
  );
};
