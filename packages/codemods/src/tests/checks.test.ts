import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { createCheckContext, tsExtensions } from "../checks/context";

const write = (root: string, relativePath: string, content: string): void => {
  const full = join(root, relativePath);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content);
};

const dirs: string[] = [];
const project = (): string => {
  const dir = mkdtempSync(join(tmpdir(), "flow-codemods-checks-"));
  dirs.push(dir);
  return dir;
};

afterEach(() => {
  // No `rm -rf` here on purpose — `mkdtempSync` already gives each test its
  // own directory under the OS temp dir, and the OS reclaims it. Nothing in
  // this suite needs cleanup to pass.
  dirs.length = 0;
});

describe("tsExtensions", () => {
  test("is ripgrep's `-t ts` type", () => {
    expect(tsExtensions).toEqual([".ts", ".tsx", ".cts", ".mts"]);
  });
});

describe("createCheckContext.files", () => {
  test("lists every file under path when no extensions are given", async () => {
    const root = project();
    write(root, "a.ts", "");
    write(root, "b.md", "");
    write(root, "nested/c.tsx", "");

    const files = await createCheckContext(root).files();

    expect(files.sort()).toEqual(
      [
        join(root, "a.ts"),
        join(root, "b.md"),
        join(root, "nested/c.tsx"),
      ].sort(),
    );
  });

  test("filters by extension when given a list", async () => {
    const root = project();
    write(root, "a.ts", "");
    write(root, "b.md", "");

    const files = await createCheckContext(root).files([".ts"]);

    expect(files).toEqual([join(root, "a.ts")]);
  });

  // The exact omission that was a Critical on this branch for the codemod
  // runner: a walk that does not exclude `node_modules` rewrites (or, here,
  // scans) a freshly populated directory after `upgrade` runs an install.
  test("excludes node_modules, dist and .git at any depth", async () => {
    const root = project();
    write(root, "src/real.ts", "");
    write(root, "node_modules/some-pkg/index.ts", "");
    write(root, "dist/build.ts", "");
    write(root, ".git/HEAD", "");
    write(root, "src/vendor/node_modules/nested/index.ts", "");

    const files = await createCheckContext(root).files();

    expect(files).toEqual([join(root, "src/real.ts")]);
  });
});

describe("createCheckContext.read", () => {
  test("reads a file's content as utf8", async () => {
    const root = project();
    write(root, "a.ts", "hello");

    expect(await createCheckContext(root).read(join(root, "a.ts"))).toBe(
      "hello",
    );
  });
});

describe("createCheckContext.search", () => {
  test("finds every match with its file and 1-based line", async () => {
    const root = project();
    write(
      root,
      "a.ts",
      'import { Align } from "@mittwald/flow-react-components";\nconst x = 1;\n',
    );
    write(root, "b.ts", "no match here");

    const findings = await createCheckContext(root).search(/\bAlign\b/);

    expect(findings).toEqual([
      {
        file: join(root, "a.ts"),
        line: 1,
        text: 'import { Align } from "@mittwald/flow-react-components";',
      },
    ]);
  });

  test("respects an extensions filter", async () => {
    const root = project();
    write(root, "a.ts", "Align");
    write(root, "a.md", "Align");

    const findings = await createCheckContext(root).search(/Align/, [".ts"]);

    expect(findings.map((finding) => finding.file)).toEqual([
      join(root, "a.ts"),
    ]);
  });

  test("a global-flagged pattern still matches every line, not just alternating ones", async () => {
    const root = project();
    write(root, "a.ts", "Align\nAlign\nAlign\n");

    const findings = await createCheckContext(root).search(/Align/g);

    expect(findings).toHaveLength(3);
  });

  test("never descends into node_modules even when searching", async () => {
    const root = project();
    write(root, "node_modules/pkg/index.ts", "Align");

    const findings = await createCheckContext(root).search(/Align/);

    expect(findings).toEqual([]);
  });
});
