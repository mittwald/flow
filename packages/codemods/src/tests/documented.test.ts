import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { allEntries } from "../catalog/entries";

const versioningPage = readFileSync(
  fileURLToPath(
    new URL(
      "../../../../apps/docs/src/content/01-get-started/versioning/index.mdx",
      import.meta.url,
    ),
  ),
  "utf8",
);

describe("the docs site and the catalogue agree", () => {
  test("every codemod id the versioning page names exists", () => {
    // The page also shows `upgrade` and `list`; those are commands, not ids.
    const commands = new Set(["upgrade", "list"]);
    const named = [
      ...versioningPage.matchAll(/flow-codemods@latest ([a-z0-9-]+)/g),
    ]
      .map((match) => match[1] as string)
      .filter((name) => !commands.has(name));
    const ids = new Set(allEntries.map((entry) => entry.id));
    expect(named.filter((id) => !ids.has(id))).toEqual([]);
  });
});
