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
    for (const entry of readCatalog()) {
      expect(committed).toContain(`<a id="${entry.id}"></a>`);
    }
  });

  test("entries appear newest first", () => {
    const order = [...committed.matchAll(/<a id="([a-z0-9-]+)"><\/a>/g)].map(
      (match) => match[1],
    );
    expect(order[0]).toBe("option-value-inferred-from-mixed-children");
    expect(order.at(-1)).toBe("renamed-css-export");
  });
});
