import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { resolveRange, type RangeDeps } from "../resolve/range";

const registry = {
  versions: ["0.2.0-alpha.646", "1.0.0", "1.0.1", "1.0.5", "1.1.0", "1.2.0"],
  distTags: { latest: "1.2.0" },
};

const project = (dependencies: Record<string, string>): string => {
  const dir = mkdtempSync(join(tmpdir(), "flow-range-"));
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "consumer", dependencies }, null, 2),
  );
  return dir;
};

const deps = (cwd: string, overrides: Partial<RangeDeps> = {}): RangeDeps => ({
  cwd,
  fetchVersions: async () => registry,
  readInstalledVersion: () => undefined,
  ...overrides,
});

describe("resolveRange", () => {
  test("resolves current and target from the manifest and the registry", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.1" });

    const range = await resolveRange("minor", deps(cwd));

    expect(range).toMatchObject({
      ok: true,
      current: "1.0.1",
      target: "1.2.0",
    });
  });

  test("a missing package.json is a clear message, not a raw ENOENT", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "flow-range-empty-"));

    const range = await resolveRange("minor", deps(cwd));

    expect(range.ok).toBe(false);
    if (!range.ok) {
      expect(range.reason).not.toContain("ENOENT");
      expect(range.reason).toContain("No package.json found");
      expect(range.reason).toContain(cwd);
    }
  });

  test("a package.json that is not valid JSON names the parse error, not the revision", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "flow-range-badjson-"));
    writeFileSync(join(cwd, "package.json"), "{ not json");

    const range = await resolveRange("minor", deps(cwd));

    expect(range.ok).toBe(false);
    if (!range.ok) {
      expect(range.reason).toContain("Could not parse");
    }
  });

  test("no Flow dependency in the manifest is reported, not silently empty", async () => {
    const cwd = project({ react: "^19.2.0" });

    const range = await resolveRange("minor", deps(cwd));

    expect(range.ok).toBe(false);
    if (!range.ok) {
      expect(range.reason).toContain("No Flow dependency");
    }
  });

  test("no published version in common across every declared dependency", async () => {
    const cwd = project({
      "@mittwald/flow-icons": "^1.0.0",
      "@mittwald/flow-react-components": "^1.0.0",
    });

    const perPackage: Record<string, typeof registry> = {
      "@mittwald/flow-icons": {
        versions: ["2.0.0"],
        distTags: { latest: "2.0.0" },
      },
      "@mittwald/flow-react-components": {
        versions: ["3.0.0"],
        distTags: { latest: "3.0.0" },
      },
    };

    const range = await resolveRange(
      "major",
      deps(cwd, {
        fetchVersions: async (name) => perPackage[name] ?? registry,
      }),
    );

    expect(range.ok).toBe(false);
    if (!range.ok) {
      expect(range.reason).toMatch(/no published version in common/i);
    }
  });

  test("an unresolvable revision names it", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.1" });

    const range = await resolveRange("nonsense", deps(cwd));

    expect(range.ok).toBe(false);
    if (!range.ok) {
      expect(range.reason).toContain("nonsense");
    }
  });

  // The same fact `upgrade` treats as a refusal (target not greater than
  // current) is not this function's call to make — it reports the resolution
  // either way, letting the caller decide. This is what makes `list minor`
  // a genuine dry run of `upgrade minor`, including the "nothing to do" case.
  test("a target at or below current still resolves 'ok' — it is not this module's refusal to make", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.2.0" });

    const range = await resolveRange("latest", deps(cwd));

    expect(range).toMatchObject({
      ok: true,
      current: "1.2.0",
      target: "1.2.0",
    });
  });

  test("the installed version wins over the declared range", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.0" });

    const range = await resolveRange(
      "major",
      deps(cwd, { readInstalledVersion: () => "1.1.0" }),
    );

    expect(range).toMatchObject({ current: "1.1.0" });
  });
});
