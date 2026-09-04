import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { readCatalog } from "../catalog/read";
import {
  renderEntry,
  renderMigrationGuide,
} from "../../dev/generate/migrationGuide";
import { unreleasedSince } from "../catalog/unreleased";

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
    expect(order[0]).toBe("use-design-tokens-build-metadata-removed");
    expect(order.at(-1)).toBe("renamed-css-export");
  });

  test("an unreleased entry says so instead of printing a bare placeholder", () => {
    const rendered = renderEntry({
      id: "something-changed",
      since: unreleasedSince,
      title: "Something changed",
      kind: "migration",
      action: "manual",
      remotePackage: false,
      apply: "Do the thing.",
      body: "Prose.",
    });

    expect(rendered).toContain(
      `**Since \`${unreleasedSince}\`** — ships in the next stable release`,
    );
  });
});
