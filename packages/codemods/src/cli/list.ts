import type { CatalogEntry } from "../catalog/entries.js";
import { selectEntries, sortBySince } from "../catalog/select.js";

export interface RenderListInput {
  entries: CatalogEntry[];
  /** Both bounds are optional. Without them the whole catalogue is listed. */
  from?: string;
  to?: string;
  json: boolean;
}

const needs: Record<CatalogEntry["action"], string> = {
  codemod: "codemod",
  manual: "by hand",
  none: "no code change",
};

const renderEntry = (entry: CatalogEntry): string => {
  const lines = [
    `${entry.id}  (${entry.since}, ${entry.kind}, ${needs[entry.action]})`,
    `  ${entry.title}`,
    `  apply:  ${entry.apply}`,
    `  verify: ${entry.verify}`,
  ];

  if (entry.detect !== undefined) {
    lines.push(`  detect: ${entry.detect}`);
  }
  if (entry.action === "codemod") {
    lines.push(`  run:    npx @mittwald/flow-codemods@latest ${entry.id} src`);
  }
  if (entry.remotePackage) {
    lines.push("  also applies to @mittwald/flow-remote-react-components");
  }

  return lines.join("\n");
};

/**
 * The migrations for a version range, as text or JSON.
 *
 * Read-only by design: this is what an agent can call to plan before it changes
 * anything. `--json` carries `apply`, `verify` and `detect` through unchanged,
 * because those are the fields it acts on.
 */
export const renderList = ({
  entries,
  from,
  to,
  json,
}: RenderListInput): string => {
  // The two paths differ in more than their bounds, deliberately: `sortBySince`
  // keeps `kind: "tool"` entries, `selectEntries` drops them. Unbounded, this is
  // a catalogue browser, and browsing is how someone finds the codemod that
  // ports an app between packages. Bounded, it answers "what does this version
  // range require of me" — and a port is never required by a version range. Do
  // not unify these.
  //
  // `0.0.0-0` rather than `0.0.0` as the lower sentinel: the gate's
  // `current < since` is strict, so `0.0.0` would hide an entry whose `since` is
  // exactly `0.0.0`. A prerelease of `0` sorts below every published version.
  // (`0.0.0-0.0` is lower still; nothing publishes that.)
  const selected =
    from === undefined && to === undefined
      ? sortBySince(entries)
      : selectEntries(entries, from ?? "0.0.0-0", to ?? "9999.0.0");

  if (json) {
    return JSON.stringify(selected, null, 2);
  }

  if (selected.length === 0) {
    return "Nothing to migrate in that range.\n";
  }

  return `${selected.map(renderEntry).join("\n\n")}\n`;
};
