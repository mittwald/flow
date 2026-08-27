import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { readCatalog } from "../catalog/read";
import { renderMigrationGuide } from "../../dev/generate/migrationGuide";

const committed = readFileSync(
  fileURLToPath(new URL("../../../components/MIGRATION.md", import.meta.url)),
  "utf8",
);

describe("the generated migration guide", () => {
  test("the committed file matches the catalogue", async () => {
    expect(await renderMigrationGuide()).toBe(committed);
  });

  test("every entry has an anchor matching its id", () => {
    // `kind: "tool"` entries are filtered out of the guide — they are not a
    // migration, so there is nothing here for a consumer to look up by version.
    for (const entry of readCatalog().filter(
      (entry) => entry.kind !== "tool",
    )) {
      expect(committed).toContain(`<a id="${entry.id}"></a>`);
    }
  });

  test("entries appear newest first", () => {
    const order = [...committed.matchAll(/<a id="([a-z0-9-]+)"><\/a>/g)].map(
      (match) => match[1],
    );
    expect(order[0]).toBe("segmented-control-deprecated");
    expect(order.at(-1)).toBe("renamed-css-export");
  });
});
