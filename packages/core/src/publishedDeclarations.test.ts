import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  acknowledgedUndeclaredTypeImports,
  assertInstallableTypeImports,
  findUndeclaredTypeImports,
  importedPackagesOf,
  packageNameOf,
  rewriteBundledImports,
  typeEntriesOf,
  withBundledDeclarations,
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

describe("assertInstallableTypeImports", () => {
  let root: string;

  const fixture = (manifest: object, declaration: string) => {
    root = mkdtempSync(path.join(tmpdir(), "installable-type-imports-"));
    mkdirSync(path.join(root, "dist/types"), { recursive: true });
    writeFileSync(path.join(root, "package.json"), JSON.stringify(manifest));
    writeFileSync(path.join(root, "dist/types/index.d.ts"), declaration);
  };

  const manifest = {
    name: "@test/installable",
    exports: { ".": { types: "./dist/types/index.d.ts" } },
    dependencies: { declared: "1" },
  };

  afterEach(() => {
    delete acknowledgedUndeclaredTypeImports[manifest.name];
    rmSync(root, { recursive: true, force: true });
  });

  test("passes when every import is declared", () => {
    fixture(manifest, `import { A } from "declared";`);

    expect(() => assertInstallableTypeImports(root)).not.toThrow();
  });

  test("names the file and the package it cannot resolve", () => {
    fixture(manifest, `import { A } from "undeclared";`);

    expect(() => assertInstallableTypeImports(root)).toThrow(
      `${path.join("dist", "types", "index.d.ts")} imports "undeclared", which @test/installable does not declare`,
    );
  });

  test("accepts an acknowledged import", () => {
    fixture(manifest, `import { A } from "undeclared";`);
    acknowledgedUndeclaredTypeImports[manifest.name] = { undeclared: "why" };

    expect(() => assertInstallableTypeImports(root)).not.toThrow();
  });

  test("fails on an acknowledgement nothing needs any more", () => {
    fixture(manifest, `import { A } from "declared";`);
    acknowledgedUndeclaredTypeImports[manifest.name] = { undeclared: "why" };

    expect(() => assertInstallableTypeImports(root)).toThrow(
      `"undeclared" is acknowledged for @test/installable in acknowledgedUndeclaredTypeImports, but no declaration imports it any more`,
    );
  });
});

describe("withBundledDeclarations", () => {
  let root: string;

  afterEach(() => rmSync(root, { recursive: true, force: true }));

  const setup = (options: {
    beforeWriteFile?: Parameters<
      typeof withBundledDeclarations
    >[0]["beforeWriteFile"];
    afterBuild?: Parameters<typeof withBundledDeclarations>[0]["afterBuild"];
  }) => {
    root = mkdtempSync(path.join(tmpdir(), "bundled-declarations-"));
    const bundledRoot = path.join(root, "node_modules/@test/bundled");
    mkdirSync(path.join(bundledRoot, "dist/types/list"), { recursive: true });
    writeFileSync(path.join(root, "package.json"), `{"name":"pkg"}`);
    writeFileSync(
      path.join(bundledRoot, "package.json"),
      `{"name":"@test/bundled"}`,
    );
    writeFileSync(
      path.join(bundledRoot, "dist/types/list/index.d.ts"),
      "export type L = 1;",
    );

    return withBundledDeclarations(
      { outDirs: "dist/types", ...options },
      { root, packages: ["@test/bundled"] },
    );
  };

  const declaration = (file: string) => path.join(root, "dist/types", file);

  test("rewrites the bundled package's imports before writing", async () => {
    const options = setup({});

    expect(
      await options.beforeWriteFile?.(
        declaration("components/List.d.ts"),
        `import { L } from "@test/bundled/list";\nimport { R } from "react";`,
      ),
    ).toEqual({
      filePath: declaration("components/List.d.ts"),
      content: `import { L } from "../_bundled/bundled/list";\nimport { R } from "react";`,
    });
  });

  test("rewrites what the wrapped hook returns, and keeps its veto", async () => {
    const options = setup({
      beforeWriteFile: (filePath, content) =>
        filePath.endsWith("skip.d.ts")
          ? false
          : {
              filePath: declaration("moved/index.d.ts"),
              content: `${content}\nexport * from "@test/bundled";`,
            },
    });

    expect(await options.beforeWriteFile?.(declaration("skip.d.ts"), "")).toBe(
      false,
    );
    expect(
      await options.beforeWriteFile?.(declaration("index.d.ts"), "// head"),
    ).toEqual({
      filePath: declaration("moved/index.d.ts"),
      content: `// head\nexport * from "../_bundled/bundled/index";`,
    });
  });

  test("copies the bundled declarations, replacing a stale copy, then runs the wrapped hook", async () => {
    const afterBuild = vi.fn(() => {
      expect(
        readFileSync(declaration("_bundled/bundled/list/index.d.ts"), "utf8"),
      ).toBe("export type L = 1;");
    });
    const options = setup({ afterBuild });
    mkdirSync(declaration("_bundled/bundled"), { recursive: true });
    writeFileSync(declaration("_bundled/bundled/stale.d.ts"), "");

    const emitted = new Map<string, string>();
    await options.afterBuild?.(emitted);

    expect(existsSync(declaration("_bundled/bundled/stale.d.ts"))).toBe(false);
    expect(afterBuild).toHaveBeenCalledWith(emitted);
  });
});
