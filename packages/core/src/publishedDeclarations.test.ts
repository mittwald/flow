import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import {
  findUndeclaredTypeImports,
  importedPackagesOf,
  packageNameOf,
  rewriteBundledImports,
  typeEntriesOf,
} from "./publishedDeclarations.ts";

describe("packageNameOf", () => {
  test("keeps the scope and drops the subpath", () => {
    expect(packageNameOf("@scope/name/deep/path")).toBe("@scope/name");
    expect(packageNameOf("name/deep")).toBe("name");
    expect(packageNameOf("name")).toBe("name");
  });
});

describe("importedPackagesOf", () => {
  test("finds every import form a declaration uses, relative ones excluded", () => {
    const content = [
      `import { A } from '@scope/a';`,
      `export { B } from "b/sub";`,
      `export declare const c: import('c').C;`,
      `import 'd';`,
      `/// <reference types="e" />`,
      `declare module "f" {}`,
      `import { local } from './local';`,
    ].join("\n");

    expect(importedPackagesOf(content).sort()).toEqual(
      ["@scope/a", "b", "c", "d", "e", "f"].sort(),
    );
  });
});

describe("rewriteBundledImports", () => {
  const typesDir = "/pkg/dist/types";
  const bundled = ["@mittwald/flow-components-base"];

  test("points the package at the copy of its declarations", () => {
    const content = `import { A } from '@mittwald/flow-components-base';\nexport type B = import('@mittwald/flow-components-base').B;`;

    expect(
      rewriteBundledImports(
        content,
        "/pkg/dist/types/components/List/typedList.d.ts",
        typesDir,
        bundled,
      ),
    ).toBe(
      `import { A } from '../../_bundled/flow-components-base/index';\nexport type B = import('../../_bundled/flow-components-base/index').B;`,
    );
  });

  test("keeps a subpath and marks a sibling as relative", () => {
    expect(
      rewriteBundledImports(
        `export * from "@mittwald/flow-components-base/list";`,
        "/pkg/dist/types/index.d.ts",
        typesDir,
        bundled,
      ),
    ).toBe(`export * from "./_bundled/flow-components-base/list";`);
  });

  test("leaves every other package and a similar name alone", () => {
    const content = `import { A } from "@mittwald/flow-components-base-extra";\nimport { B } from "react";`;

    expect(
      rewriteBundledImports(
        content,
        "/pkg/dist/types/a.d.ts",
        typesDir,
        bundled,
      ),
    ).toBe(content);
  });
});

describe("typeEntriesOf", () => {
  test("collects every types condition, however deep", () => {
    expect(
      typeEntriesOf({
        name: "x",
        types: "./dist/types/index.d.ts",
        exports: {
          ".": { types: "./dist/types/index.d.ts", import: "./dist/index.mjs" },
          "./sub": { import: { types: "./dist/types/sub.d.ts" } },
          "./styles.css": "./dist/styles.css",
        },
      }).sort(),
    ).toEqual(["./dist/types/index.d.ts", "./dist/types/sub.d.ts"]);
  });
});

describe("findUndeclaredTypeImports", () => {
  let root: string;

  const write = (file: string, content: string) => {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), content);
  };

  afterEach(() => rmSync(root, { recursive: true, force: true }));

  const fixture = (manifest: object) => {
    root = mkdtempSync(path.join(tmpdir(), "published-declarations-"));
    write("package.json", JSON.stringify(manifest));
    write(
      "dist/types/index.d.ts",
      `import { A } from 'declared';\nexport * from './model';\nexport type N = import('node:fs').Stats;`,
    );
    write("dist/types/model/index.d.ts", `import { B } from 'undeclared';`);
    write("dist/types/stories/lib.d.ts", `import { C } from 'storybook';`);
  };

  test("reports a reachable import of a package the consumer does not get", () => {
    fixture({
      name: "pkg",
      exports: { ".": { types: "./dist/types/index.d.ts" } },
      dependencies: { declared: "1" },
    });

    expect(findUndeclaredTypeImports(root)).toEqual([
      {
        file: path.join("dist", "types", "model", "index.d.ts"),
        packageName: "undeclared",
      },
    ]);
  });

  test("accepts peer and optional dependencies", () => {
    fixture({
      name: "pkg",
      exports: { ".": { types: "./dist/types/index.d.ts" } },
      peerDependencies: { declared: "1" },
      optionalDependencies: { undeclared: "1" },
    });

    expect(findUndeclaredTypeImports(root)).toEqual([]);
  });
});
