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
  install: (manager) => recorded.installs.push(manager),
  runCodemod: ({ id }) => {
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
        install: () => order.push("install"),
        runCodemod: ({ id }) => {
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

  test("a target at or below the current version changes nothing", async () => {
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
    expect(recorded.codemods).toEqual([]);
    expect(recorded.output.join("\n")).toMatch(/already on/i);
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
});
