import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { runCodemod } from "../run/jscodeshift";

const project = (source: string): string => {
  const dir = mkdtempSync(join(tmpdir(), "flow-codemods-run-"));
  writeFileSync(join(dir, "input.tsx"), source);
  return dir;
};

const usesAlign = `import { Align } from "@mittwald/flow-react-components";
export const Row = () => <Align />;
`;

describe("runCodemod", () => {
  test("applies a codemod by its catalogue id and reports the change", async () => {
    const dir = project(usesAlign);
    const result = await runCodemod({ id: "align-to-combine", path: dir });

    expect(result).toMatchObject({
      errors: 0,
      changed: 1,
      processedNothing: false,
    });
    expect(readFileSync(join(dir, "input.tsx"), "utf8")).toContain("Combine");
  });

  test("a file the codemod does not touch counts as unmodified, not an error", async () => {
    const dir = project(`export const nothing = 1;\n`);
    const result = await runCodemod({ id: "align-to-combine", path: dir });

    expect(result).toMatchObject({ errors: 0, changed: 0, unmodified: 1 });
  });

  test("--dry leaves the file alone but still reports what it would change", async () => {
    const dir = project(usesAlign);
    const result = await runCodemod({
      id: "align-to-combine",
      path: dir,
      dry: true,
    });

    expect(result.changed).toBe(1);
    expect(readFileSync(join(dir, "input.tsx"), "utf8")).toContain("Align");
  });

  // The regression this module exists to prevent: the CLI's text summary would
  // have this file's `// 42 ok` beat the real count, because `--print` writes
  // the source before the summary.
  test("--print cannot corrupt the counts", async () => {
    const dir = project(`// 42 ok and 7 errors, to fool a regex\n${usesAlign}`);
    const result = await runCodemod({
      id: "align-to-combine",
      path: dir,
      print: true,
    });

    expect(result).toMatchObject({ changed: 1, errors: 0 });
  });

  test("a path with nothing to process says so instead of reporting zero changes", async () => {
    const result = await runCodemod({
      id: "align-to-combine",
      path: join(tmpdir(), "flow-codemods-nothing-here"),
    });

    expect(result.processedNothing).toBe(true);
  });

  // The regression Group A exists to prevent: `upgrade` runs codemods after the
  // install, so `node_modules` is freshly populated underneath. Without an
  // extension/ignore filter, the Runner's walk takes every file under the
  // path — including a dependency's source — and non-JS files like
  // `package.json` fail to parse, which reads as `errors > 0`.
  test("does not walk into node_modules", async () => {
    const dir = mkdtempSync(join(tmpdir(), "flow-codemods-node-modules-"));
    mkdirSync(join(dir, "app"), { recursive: true });
    mkdirSync(join(dir, "node_modules", "dep"), { recursive: true });
    writeFileSync(join(dir, "app", "a.tsx"), usesAlign);
    writeFileSync(join(dir, "node_modules", "dep", "index.tsx"), usesAlign);
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ name: "consumer" }),
    );

    const result = await runCodemod({ id: "align-to-combine", path: dir });

    expect(result.errors).toBe(0);
    expect(result.changed).toBe(1);
    expect(readFileSync(join(dir, "app", "a.tsx"), "utf8")).toContain(
      "Combine",
    );
    const dependencySource = readFileSync(
      join(dir, "node_modules", "dep", "index.tsx"),
      "utf8",
    );
    expect(dependencySource).toContain("Align");
    expect(dependencySource).not.toContain("Combine");
  });

  test("an unknown id fails with a message naming it", async () => {
    const dir = project(usesAlign);
    await expect(
      runCodemod({ id: "no-such-codemod", path: dir }),
    ).rejects.toThrow(/no-such-codemod/);
  });
});
