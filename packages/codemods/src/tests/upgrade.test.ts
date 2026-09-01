import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parseArguments } from "../cli/args";
import { runUpgrade, type UpgradeDeps } from "../cli/upgrade";

const registry = {
  versions: ["0.2.0-alpha.646", "1.0.0", "1.0.1", "1.0.5", "1.1.0", "1.2.0"],
  distTags: { latest: "1.2.0" },
};

const project = (dependencies: Record<string, string>): string => {
  const dir = mkdtempSync(join(tmpdir(), "flow-upgrade-"));
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "consumer", dependencies }, null, 2),
  );
  return dir;
};

const manifestOf = (dir: string): { dependencies: Record<string, string> } =>
  JSON.parse(readFileSync(join(dir, "package.json"), "utf8")) as {
    dependencies: Record<string, string>;
  };

interface Recorded {
  /** The detected agent per install — `install` now returns its description. */
  installs: string[];
  codemods: string[];
  output: string[];
}

const deps = (
  cwd: string,
  recorded: Recorded,
  overrides: Partial<UpgradeDeps> = {},
): UpgradeDeps => ({
  cwd,
  fetchVersions: async () => registry,
  install: (manager) => {
    recorded.installs.push(manager.agent);
    return `${manager.agent} — stubbed`;
  },
  // Async: `UpgradeDeps["runCodemod"]` is `typeof runCodemod`, and the real
  // implementation is async — a sync double would not be assignable to it.
  runCodemod: async ({ id }) => {
    recorded.codemods.push(id);
    return {
      changed: 1,
      unmodified: 0,
      skipped: 0,
      errors: 0,
      processedNothing: false,
    };
  },
  choose: async (entries) => entries,
  isDirty: () => false,
  readInstalledVersion: () => undefined,
  log: (message) => recorded.output.push(message),
  ...overrides,
});

const record = (): Recorded => ({ installs: [], codemods: [], output: [] });

describe("runUpgrade", () => {
  test("bumps every Flow dependency, installs, then runs the codemods", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
      "@mittwald/flow-icons-pro": "0.2.0-alpha.640",
      react: "^19.2.0",
    });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded),
    );

    expect(code).toBe(0);
    expect(manifestOf(cwd).dependencies).toEqual({
      "@mittwald/flow-react-components": "^1.2.0",
      "@mittwald/flow-icons-pro": "1.2.0",
      react: "^19.2.0",
    });
    expect(recorded.installs).toEqual(["npm"]);
    expect(recorded.codemods.length).toBeGreaterThan(0);
  });

  test("the install happens before any codemod runs", async () => {
    const order: string[] = [];
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();

    await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded, {
        install: () => {
          order.push("install");
          return "stubbed";
        },
        runCodemod: async ({ id }) => {
          order.push(`codemod:${id}`);
          return {
            changed: 0,
            unmodified: 1,
            skipped: 0,
            errors: 0,
            processedNothing: false,
          };
        },
      }),
    );

    expect(order[0]).toBe("install");
  });

  test("a target at or below the current version writes and installs nothing, but still catches up on codemods", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.2.0" });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "latest", "-y"]),
      deps(cwd, recorded),
    );

    expect(code).toBe(0);
    expect(manifestOf(cwd).dependencies).toEqual({
      "@mittwald/flow-react-components": "^1.2.0",
    });
    expect(recorded.installs).toEqual([]);
    // Dropping the lower bound for codemods (selectEntries) is exactly what
    // makes this differ from before: "current == target" no longer means
    // "nothing crosses since", because a codemod entry has no lower bound to
    // cross in the first place — every real codemod in the catalogue ships
    // behind this test's mocked target, so all of them are catch-up.
    expect(recorded.codemods.length).toBeGreaterThan(0);
    expect(recorded.output.join("\n")).toMatch(/already on/i);
    expect(recorded.output.join("\n")).toMatch(/no dependency bump needed/i);
  });

  test("the closing summary reports how many codemods ran and how many changed something", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();

    await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded),
    );

    // The default `runCodemod` double reports `changed: 1` for every entry,
    // so "run" and "changed" agree here.
    const output = recorded.output.join("\n");
    expect(output).toMatch(/\d+ codemods? run, \d+ changed something\./);
  });

  test("0 changed reads as confirmation, not failure, when every codemod is a no-op", async () => {
    // This is the shape the fix exists for: a project sitting on a version
    // that never crosses a boundary, whose codemods all report nothing to do
    // — "N run, 0 changed" is that confirmation, and the run still succeeds.
    const cwd = project({ "@mittwald/flow-react-components": "^1.2.0" });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "latest", "-y"]),
      deps(cwd, recorded, {
        runCodemod: async ({ id }) => {
          recorded.codemods.push(id);
          return {
            changed: 0,
            unmodified: 1,
            skipped: 0,
            errors: 0,
            processedNothing: false,
          };
        },
      }),
    );

    expect(code).toBe(0);
    const output = recorded.output.join("\n");
    expect(output).toMatch(/\d+ codemods? run, 0 changed something\./);
  });

  test("a dirty tree is refused, and --allow-dirty overrides it", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.1" });
    const dirty = record();

    const refused = await runUpgrade(
      parseArguments(["upgrade", "-y"]),
      deps(cwd, dirty, { isDirty: () => true }),
    );

    expect(refused).toBe(1);
    expect(dirty.installs).toEqual([]);
    expect(dirty.output.join("\n")).toMatch(/uncommitted|--allow-dirty/);
    // The guard fires before the manifest is even read — a refusal must not
    // leave a half-applied bump behind.
    expect(manifestOf(cwd).dependencies).toEqual({
      "@mittwald/flow-react-components": "^1.0.1",
    });

    const allowed = record();
    const code = await runUpgrade(
      parseArguments(["upgrade", "-y", "--allow-dirty"]),
      deps(cwd, allowed, { isDirty: () => true }),
    );
    expect(code).toBe(0);
  });

  test("a manifest with no Flow dependency is an error, not a silent success", async () => {
    const cwd = project({ react: "^19.2.0" });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "-y"]),
      deps(cwd, recorded),
    );

    expect(code).toBe(1);
    expect(recorded.output.join("\n")).toContain("No Flow");
  });

  test("an unresolvable revision names what it could not resolve", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.1" });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "next", "-y"]),
      deps(cwd, recorded),
    );

    expect(code).toBe(1);
    expect(recorded.output.join("\n")).toContain("next");
  });

  test("the entries no codemod covers are printed at the end", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();

    await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded),
    );

    const output = recorded.output.join("\n");
    expect(output).toContain("by hand");
    expect(output).toContain("table-render-prop-removed");
  });

  test("the installed version wins over the declared range", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.0" });
    const recorded = record();

    await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded, { readInstalledVersion: () => "1.1.0" }),
    );

    // 1.1.0, not 1.0.0 — nothing between them is selected.
    expect(recorded.output.join("\n")).toContain("1.1.0");
  });

  test("the manifest is bumped before the install runs, not after", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();
    let duringInstall: string | undefined;

    await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded, {
        install: (manager) => {
          recorded.installs.push(manager.agent);
          duringInstall =
            manifestOf(cwd).dependencies["@mittwald/flow-react-components"];
          return `${manager.agent} — stubbed`;
        },
      }),
    );

    expect(duringInstall).toBe("^1.2.0");
  });

  test("--dry writes nothing, installs nothing, and still prints the by-hand list", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();
    const before = readFileSync(join(cwd, "package.json"), "utf8");

    const code = await runUpgrade(
      parseArguments(["upgrade", "major", "-y", "--dry"]),
      deps(cwd, recorded),
    );

    expect(code).toBe(0);
    expect(recorded.installs).toEqual([]);
    expect(readFileSync(join(cwd, "package.json"), "utf8")).toBe(before);
    expect(recorded.output.join("\n")).toContain("by hand");
  });

  test("a throwing install returns 1 and names both versions plus the recovery", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded, {
        install: () => {
          throw new Error("network unreachable");
        },
      }),
    );

    expect(code).toBe(1);
    const output = recorded.output.join("\n");
    expect(output).toContain("1.2.0");
    expect(output).toContain("0.2.0-alpha.640");
    expect(output).toContain("git checkout package.json");
    expect(output).toContain("network unreachable");
    // The manifest stays bumped — a failed install does not roll it back.
    expect(manifestOf(cwd).dependencies).toEqual({
      "@mittwald/flow-react-components": "^1.2.0",
    });
  });

  test("a throwing codemod does not stop the remaining ones, and the run returns 1", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();
    let calls = 0;

    const code = await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded, {
        runCodemod: async ({ id }) => {
          calls += 1;
          recorded.codemods.push(id);
          if (calls === 1) {
            throw new Error("boom");
          }
          return {
            changed: 1,
            unmodified: 0,
            skipped: 0,
            errors: 0,
            processedNothing: false,
          };
        },
      }),
    );

    expect(code).toBe(1);
    expect(recorded.codemods.length).toBeGreaterThan(1);
    expect(recorded.output.join("\n")).toContain("did not complete");
  });

  test("errors reported by a codemod fail the run", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();

    const code = await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded, {
        runCodemod: async ({ id }) => {
          recorded.codemods.push(id);
          return {
            changed: 0,
            unmodified: 0,
            skipped: 0,
            errors: 2,
            processedNothing: false,
          };
        },
      }),
    );

    expect(code).toBe(1);
  });

  test("declining a subset in `choose` runs only that subset", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^0.2.0-alpha.640",
    });
    const recorded = record();

    await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded, {
        choose: async (entries) => entries.slice(0, 1),
      }),
    );

    expect(recorded.codemods).toHaveLength(1);
  });

  // Reproduces #2887-adjacent bug: fixed versioning keeps package.json
  // versions equal, but Lerna only publishes changed packages, so two Flow
  // dependencies' published histories genuinely diverge. Resolving the target
  // from whichever dependency happens to be checked first can write a version
  // the other one never published — the fix resolves from the intersection.
  test("the target is resolved from the intersection of every declared dependency's published versions, not one anchor", async () => {
    const cwd = project({
      // Alphabetically first, so a naive "first dependency found" anchor
      // would pick this package's list — which reaches further than the
      // other's.
      "@mittwald/flow-icons": "^1.0.0",
      "@mittwald/flow-react-components": "^1.0.0",
    });
    const recorded = record();

    const perPackage: Record<
      string,
      { versions: string[]; distTags: Record<string, string> }
    > = {
      "@mittwald/flow-icons": {
        versions: ["1.0.0", "1.0.1", "1.0.5", "1.0.6"],
        distTags: { latest: "1.0.6" },
      },
      "@mittwald/flow-react-components": {
        versions: ["1.0.0", "1.0.1", "1.0.5"],
        distTags: { latest: "1.0.5" },
      },
    };

    const code = await runUpgrade(
      parseArguments(["upgrade", "minor", "-y"]),
      deps(cwd, recorded, {
        fetchVersions: async (name) => perPackage[name] ?? registry,
        readInstalledVersion: () => "1.0.0",
      }),
    );

    expect(code).toBe(0);
    // 1.0.5 — the highest version BOTH packages published — never 1.0.6,
    // which flow-react-components never published.
    expect(manifestOf(cwd).dependencies).toEqual({
      "@mittwald/flow-icons": "^1.0.5",
      "@mittwald/flow-react-components": "^1.0.5",
    });
  });

  test("an empty intersection of published versions is refused before anything is written", async () => {
    const cwd = project({
      "@mittwald/flow-icons": "^1.0.0",
      "@mittwald/flow-react-components": "^1.0.0",
    });
    const recorded = record();
    const before = readFileSync(join(cwd, "package.json"), "utf8");

    const perPackage: Record<
      string,
      { versions: string[]; distTags: Record<string, string> }
    > = {
      "@mittwald/flow-icons": {
        versions: ["2.0.0"],
        distTags: { latest: "2.0.0" },
      },
      "@mittwald/flow-react-components": {
        versions: ["3.0.0"],
        distTags: { latest: "3.0.0" },
      },
    };

    const code = await runUpgrade(
      parseArguments(["upgrade", "major", "-y"]),
      deps(cwd, recorded, {
        fetchVersions: async (name) => perPackage[name] ?? registry,
        readInstalledVersion: () => "1.0.0",
      }),
    );

    expect(code).toBe(1);
    expect(readFileSync(join(cwd, "package.json"), "utf8")).toBe(before);
    expect(recorded.output.join("\n")).toMatch(
      /no published version in common/i,
    );
  });

  test("a dist-tag pointing outside the intersection is not written onto the manifest", async () => {
    const cwd = project({
      "@mittwald/flow-icons": "^1.0.0",
      "@mittwald/flow-react-components": "^1.0.0",
    });
    const recorded = record();
    const before = readFileSync(join(cwd, "package.json"), "utf8");

    const perPackage: Record<
      string,
      { versions: string[]; distTags: Record<string, string> }
    > = {
      "@mittwald/flow-icons": {
        versions: ["1.0.0", "1.0.6"],
        distTags: { latest: "1.0.6" },
      },
      "@mittwald/flow-react-components": {
        versions: ["1.0.0"],
        distTags: { latest: "1.0.6" },
      },
    };

    const code = await runUpgrade(
      parseArguments(["upgrade", "latest", "-y"]),
      deps(cwd, recorded, {
        fetchVersions: async (name) => perPackage[name] ?? registry,
        readInstalledVersion: () => "1.0.0",
      }),
    );

    expect(code).toBe(1);
    expect(readFileSync(join(cwd, "package.json"), "utf8")).toBe(before);
  });
});
