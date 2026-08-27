import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { createCheckContext } from "../checks/context";
import { loadVerifier } from "../checks/load";
import type { Verifier, VerifyResult } from "../checks/types";
import { renderVerify, runVerify, summarize } from "../cli/verify";

const write = (root: string, relativePath: string, content: string): void => {
  const full = join(root, relativePath);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content);
};

const project = (): string =>
  mkdtempSync(join(tmpdir(), "flow-codemods-verify-"));

const entry = (id: string): CatalogEntry => ({
  id,
  since: "1.0.0",
  title: `Title for ${id}`,
  kind: "migration",
  action: "manual",
  remotePackage: true,
  apply: `apply ${id}`,
});

describe("the three proof verifiers", () => {
  test("align-to-combine: ok is false while Align remains, and carries the tsc hint", async () => {
    const root = project();
    write(root, "src/App.tsx", "<Align />");

    const verifier = await loadVerifier("align-to-combine");
    const result = await verifier?.verify(createCheckContext(root));

    expect(result?.ok).toBe(false);
    expect(result?.findings.length).toBeGreaterThan(0);
    expect(result?.hints.join(" ")).toMatch(/tsc --noEmit/);
  });

  test("align-to-combine: ok is true once nothing remains", async () => {
    const root = project();
    write(root, "src/App.tsx", "<Combine />");

    const verifier = await loadVerifier("align-to-combine");
    const result = await verifier?.verify(createCheckContext(root));

    expect(result?.ok).toBe(true);
    expect(result?.findings).toEqual([]);
  });

  test("tooltip-trigger-delay-type: always ok, always carries the tsc hint — the typecheck is the whole check", async () => {
    const verifier = await loadVerifier("tooltip-trigger-delay-type");
    const result = await verifier?.verify(createCheckContext(project()));

    expect(result?.ok).toBe(true);
    expect(result?.findings).toEqual([]);
    expect(result?.hints.length).toBeGreaterThan(0);
    expect(result?.hints.join(" ")).toMatch(/tsc --noEmit/);
  });

  test("overlay-controller: ok is true with a hint saying no compiler check catches it", async () => {
    const verifier = await loadVerifier(
      "overlay-controller-add-on-close-return-type",
    );
    const result = await verifier?.verify(createCheckContext(project()));

    expect(result?.ok).toBe(true);
    expect(result?.findings).toEqual([]);
    expect(result?.hints.join(" ")).toMatch(/No compiler check catches this/);
  });
});

describe("loadVerifier", () => {
  test("returns undefined for an id with no module yet", async () => {
    expect(await loadVerifier("segmented-control-deprecated")).toBeUndefined();
  });
});

const fakeVerifier = (result: VerifyResult): Verifier => ({
  verify: async () => result,
});

describe("runVerify", () => {
  test("skips entries with no verifier module", async () => {
    const entries = [entry("has-one"), entry("has-none")];
    const load = async (id: string) =>
      id === "has-one"
        ? fakeVerifier({ ok: true, findings: [], hints: [] })
        : undefined;

    const results = await runVerify("/anywhere", { entries, load });

    expect(results.map((r) => r.entry.id)).toEqual(["has-one"]);
  });
});

// The honesty requirement: getting this wrong reproduced a failure this
// branch already fixed three times — something reporting success without
// having checked. `ok: true` on a judgement-only entry means "nothing this
// module could decide is wrong," never "this migration is done."
describe("the honesty requirement", () => {
  const judgementOnly = (id: string): VerifyEntry => ({
    entry: entry(id),
    result: {
      ok: true,
      findings: [],
      hints: [`${id} needs a person to review it by hand.`],
    },
  });

  test("summarize reports two numbers, not one pass/fail verdict", () => {
    const results = [judgementOnly("a"), judgementOnly("b")];

    expect(summarize(results)).toEqual({ passed: 2, needsPerson: 2 });
  });

  test("a run whose entries are all judgement-only never claims success", () => {
    const results = [judgementOnly("a"), judgementOnly("b")];
    const text = renderVerify(results, "/project/src");

    expect(text.toLowerCase()).not.toContain("done");
    expect(text.toLowerCase()).not.toContain("complete");
    // The two numbers, not a collapsed one: `ok: true` on every entry does
    // not mean "2/2 done" — it means 2 checks passed and 2 still need a
    // person, and both numbers are printed.
    expect(text).toContain("2/2");
    expect(text).toContain("2 entries still need a person");
  });

  test("a mix of pass, fail and judgement-only reports all three honestly", () => {
    const results: VerifyEntry[] = [
      judgementOnly("judged"),
      {
        entry: entry("failing"),
        result: {
          ok: false,
          findings: [{ file: "a.ts", line: 1, text: "Align" }],
          hints: ["run tsc"],
        },
      },
      {
        entry: entry("passing"),
        result: { ok: true, findings: [], hints: [] },
      },
    ];

    const summary = summarize(results);
    expect(summary).toEqual({ passed: 2, needsPerson: 2 });

    const text = renderVerify(results, "/project/src");
    expect(text.toLowerCase()).not.toContain("done");
    expect(text.toLowerCase()).not.toContain("complete");
  });
});

interface VerifyEntry {
  entry: CatalogEntry;
  result: VerifyResult;
}

describe("renderVerify — a hint is never orphaned from its migration", () => {
  test("the migration's id precedes every one of its hints", () => {
    const results: VerifyEntry[] = [
      {
        entry: entry("overlay-controller-add-on-close-return-type"),
        result: {
          ok: true,
          findings: [],
          hints: ["Review each handler by hand."],
        },
      },
    ];

    const text = renderVerify(results, "/project/src");
    const idIndex = text.indexOf("overlay-controller-add-on-close-return-type");
    const hintIndex = text.indexOf("Review each handler by hand.");

    expect(idIndex).toBeGreaterThanOrEqual(0);
    expect(hintIndex).toBeGreaterThan(idIndex);
  });

  test("with several migrations, each one's hints stay directly under its own id", () => {
    const results: VerifyEntry[] = [
      {
        entry: entry("first"),
        result: { ok: true, findings: [], hints: ["hint for first"] },
      },
      {
        entry: entry("second"),
        result: { ok: true, findings: [], hints: ["hint for second"] },
      },
    ];

    const text = renderVerify(results, "/project/src");
    const firstId = text.indexOf("first");
    const firstHint = text.indexOf("hint for first");
    const secondId = text.indexOf("second");
    const secondHint = text.indexOf("hint for second");

    expect(firstId).toBeLessThan(firstHint);
    expect(firstHint).toBeLessThan(secondId);
    expect(secondId).toBeLessThan(secondHint);
  });
});

describe("renderVerify", () => {
  test("says so when no verifiers are available yet", () => {
    expect(renderVerify([], "/project/src")).toContain(
      "No verifiers are available",
    );
  });
});
