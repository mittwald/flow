import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import type { MigrationEntry } from "./types.js";

const migrationsDir = fileURLToPath(new URL("../migrations", import.meta.url));

/** Frontmatter delimited by `---` lines, then the Markdown body. */
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

const requiredStrings = ["since", "title", "kind", "action", "apply"];

const parseEntry = (file: string, source: string): MigrationEntry => {
  // A function declaration, not an arrow: only that form narrows control flow
  // after the call, so the checks below do not need a redundant `throw`. The
  // bundler this package used to ship had the same note for the same reason.
  function fail(message: string): never {
    throw new Error(`${basename(file)}: ${message}`);
  }

  const match = frontmatterPattern.exec(source);
  if (!match) {
    fail("has no `---` frontmatter block");
  }

  const [, frontmatter = "", body = ""] = match;
  const data = parse(frontmatter) as Record<string, unknown>;

  for (const key of requiredStrings) {
    if (typeof data[key] !== "string" || data[key] === "") {
      fail(`is missing the required string field \`${key}\``);
    }
  }
  if (typeof data.remotePackage !== "boolean") {
    fail("is missing the required boolean field `remotePackage`");
  }

  return {
    id: basename(file, ".md"),
    since: data.since as string,
    title: data.title as string,
    kind: data.kind as MigrationEntry["kind"],
    action: data.action as MigrationEntry["action"],
    remotePackage: data.remotePackage,
    apply: data.apply as string,
    body: body.trim(),
  };
};

/**
 * Every catalogue entry, unordered.
 *
 * Build time only: it reads `src/migrations`, which the published package ships
 * but the CLI never parses. The CLI imports `catalog/entries` instead.
 *
 * Callers that need an order sort by `since` with `semver` — a string sort puts
 * `alpha.712` after `alpha.1046`, which is wrong. See `sortBySince`.
 */
export const readCatalog = (): MigrationEntry[] =>
  readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const path = join(migrationsDir, file);
      return parseEntry(path, readFileSync(path, "utf8"));
    });
