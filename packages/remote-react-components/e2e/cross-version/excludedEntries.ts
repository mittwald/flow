/**
 * Reused e2e entries whose remote-rendered host HTML legitimately DIFFERS
 * between an old version and current because the component's output structure
 * evolved — not because an old extension is broken. A strict HTML-equality
 * comparison would flag these as failures, so they are excluded here with the
 * reason recorded. Remove an entry once the relevant component no longer
 * diverges across the tested version range.
 *
 * This is the entry-level analogue of `cross-version.exclude.json` (which
 * excludes whole broken published versions).
 */
export interface ExcludedEntry {
  /** Entry file, as the host test derives it: leading-slash, no `../tests`. */
  entryFile: string;
  exportName: string;
  reason: string;
}

export const excludedEntries: ExcludedEntry[] = [
  {
    entryFile: "/Modal.browser.test.remote.tsx",
    exportName: "inList",
    reason:
      "List gained an always-present, visually-hidden empty-view wrapper after ~alpha.791. Versions <= alpha.791 render List without it, so the host HTML differs. A stable structural evolution of List, not a backwards-compat break.",
  },
];

export const isExcludedEntry = (
  entryFile: string,
  exportName: string,
): boolean =>
  excludedEntries.some(
    (excluded) =>
      excluded.entryFile === entryFile && excluded.exportName === exportName,
  );
