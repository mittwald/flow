import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { createCheckContext } from "../checks/context";
import { loadDetector } from "../checks/load";
import type { Detector, Finding } from "../checks/types";
import { renderDetect, runDetect } from "../cli/detect";

const write = (root: string, relativePath: string, content: string): void => {
  const full = join(root, relativePath);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content);
};

const project = (): string =>
  mkdtempSync(join(tmpdir(), "flow-codemods-detect-"));

const entry = (id: string): CatalogEntry => ({
  id,
  since: "1.0.0",
  title: `Title for ${id}`,
  kind: "migration",
  action: "manual",
  remotePackage: true,
  detect: `rg ${id}`,
  apply: `apply ${id}`,
  verify: `verify ${id}`,
});

describe("the align-to-combine detector", () => {
  test("finds Align and AlignProps usage under a project", async () => {
    const root = project();
    write(
      root,
      "src/App.tsx",
      'import { Align, type AlignProps } from "@mittwald/flow-react-components";\n',
    );
    write(root, "src/Other.tsx", "no match here");

    const detector = await loadDetector("align-to-combine");
    expect(detector).toBeDefined();

    const findings = await detector?.detect(createCheckContext(root));

    expect(findings?.length).toBeGreaterThan(0);
    expect(findings?.[0]?.file).toBe(join(root, "src/App.tsx"));
  });

  test("finds nothing once Align is gone", async () => {
    const root = project();
    write(
      root,
      "src/App.tsx",
      'import { Combine } from "@mittwald/flow-react-components";\n',
    );

    const detector = await loadDetector("align-to-combine");
    const findings = await detector?.detect(createCheckContext(root));

    expect(findings).toEqual([]);
  });
});

describe("the tooltip-trigger-delay-type and overlay-controller detectors", () => {
  test("both exist and carry a description", async () => {
    const tooltip = await loadDetector("tooltip-trigger-delay-type");
    const overlay = await loadDetector(
      "overlay-controller-add-on-close-return-type",
    );

    expect(tooltip?.description).toBeTruthy();
    expect(overlay?.description).toBeTruthy();
  });
});

describe("loadDetector", () => {
  test("returns undefined for an id with no module yet", async () => {
    expect(await loadDetector("segmented-control-deprecated")).toBeUndefined();
  });
});

describe("runDetect", () => {
  const fakeDetector = (findings: Finding[]): Detector => ({
    description: "fake",
    detect: async () => findings,
  });

  test("skips entries with no detector module, without failing the run", async () => {
    const entries = [entry("has-one"), entry("has-none")];
    const load = async (id: string) =>
      id === "has-one" ? fakeDetector([]) : undefined;

    const results = await runDetect("/anywhere", { entries, load });

    expect(results).toEqual([]);
  });

  test("reports only entries with at least one finding", async () => {
    const entries = [entry("touched"), entry("untouched")];
    const finding: Finding = { file: "a.ts", line: 1, text: "Align" };
    const load = async (id: string) =>
      id === "touched" ? fakeDetector([finding]) : fakeDetector([]);

    const results = await runDetect("/anywhere", { entries, load });

    expect(results.map((r) => r.entry.id)).toEqual(["touched"]);
    expect(results[0]?.findings).toEqual([finding]);
  });
});

describe("renderDetect", () => {
  test("says so when nothing was found", () => {
    expect(renderDetect([], "/project/src")).toContain(
      "No migrations under /project/src",
    );
  });

  test("names the migration and the file:line of each finding", () => {
    const text = renderDetect(
      [
        {
          entry: entry("align-to-combine"),
          findings: [{ file: "src/App.tsx", line: 12, text: "<Align>" }],
        },
      ],
      "/project/src",
    );

    expect(text).toContain("align-to-combine");
    expect(text).toContain("src/App.tsx:12");
    expect(text).toContain("<Align>");
  });

  test("plain text carries no ANSI by default", () => {
    const text = renderDetect(
      [
        {
          entry: entry("align-to-combine"),
          findings: [{ file: "a.ts", line: 1, text: "Align" }],
        },
      ],
      "/project",
    );
    // Built from a char code, not a literal escape, same as `list.ts`'s own
    // `ansi` regex — so no control character sits in this source either.
    expect(text).not.toMatch(new RegExp(`${String.fromCharCode(27)}\\[`));
  });
});
