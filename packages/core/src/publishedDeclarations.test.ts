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
  declarationGraphOf,
  findUndeclaredTypeImports,
  importedPackagesOf,
  packageNameOf,
  referencedTypesOf,
  rewriteBundledImports,
  typeEntriesOf,
  typesPackagesOf,
  untypedExportsOf,
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
      ["@scope/a", "b", "c", "d", "f"].sort(),
    );
  });
});

describe("referencedTypesOf", () => {
  test("finds every reference to types, not to paths", () => {
    const content = [
      `/// <reference types="node" />`,
      `/// <reference types='vite/client' />`,
      `/// <reference path="./globals.d.ts" />`,
    ].join("\n");

    expect(referencedTypesOf(content)).toEqual(["node", "vite/client"]);
  });
});

describe("typesPackagesOf", () => {
  test("names the package and its DefinitelyTyped package", () => {
    expect(typesPackagesOf("vite/client")).toEqual(["vite", "@types/vite"]);
    expect(typesPackagesOf("@scope/name")).toEqual([
      "@scope/name",
      "@types/scope__name",
    ]);
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

describe("untypedExportsOf", () => {
  test("names every subpath that reaches JavaScript without types", () => {
    expect(
      untypedExportsOf({
        name: "x",
        exports: {
          ".": { types: "./dist/index.d.ts", default: "./dist/index.mjs" },
          "./untyped": { import: "./dist/untyped.mjs" },
          "./nested": {
            import: { types: "./dist/n.d.mts", default: "./dist/n.mjs" },
            require: { default: "./dist/n.cjs" },
          },
          "./bare": "./dist/bare.js",
          "./styles.css": "./dist/styles.css",
          "./data": "./dist/data.json",
        },
      }),
    ).toEqual(["./untyped", "./nested", "./bare"]);
  });

  test("reads conditions and strings without subpaths as the root", () => {
    expect(untypedExportsOf({ name: "x", exports: "./index.js" })).toEqual([
      ".",
    ]);
    expect(
      untypedExportsOf({ name: "x", exports: { default: "./index.js" } }),
    ).toEqual(["."]);
    expect(
      untypedExportsOf({
        name: "x",
        exports: { types: "./index.d.ts", default: "./index.js" },
      }),
    ).toEqual([]);
  });
});

describe("declarationGraphOf", () => {
  let root: string;

  const write = (file: string, content: string) => {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), content);
  };

  const fixture = (exports: unknown, files: Record<string, string> = {}) => {
    root = mkdtempSync(path.join(tmpdir(), "declaration-graph-"));
    write("package.json", JSON.stringify({ name: "pkg", exports }));
    for (const [file, content] of Object.entries(files)) {
      write(file, content);
    }
  };

  const relative = (files: string[]) =>
    files.map((file) => path.relative(root, file)).sort();

  afterEach(() => rmSync(root, { recursive: true, force: true }));

  test("fails when the manifest names no types entry", () => {
    fixture({ ".": { default: "./dist/index.mjs" } });

    expect(declarationGraphOf(root).problems).toEqual([
      `exports["."] points at JavaScript without a "types" condition — a consumer gets no declarations for it.`,
      `package.json names no "types" entry — nothing to check.`,
    ]);
  });

  test("fails on a types entry that does not exist", () => {
    fixture({ ".": { types: "./dist/types/index.d.ts" } });

    expect(declarationGraphOf(root).problems).toEqual([
      `The "types" entry "./dist/types/index.d.ts" matches no file.`,
    ]);
  });

  test("follows every file a pattern entry matches", () => {
    fixture(
      { "./icons/*": { types: "./dist/types/icons/*.d.ts" } },
      {
        "dist/types/icons/a.d.ts": `export * from "../shared";`,
        "dist/types/icons/nested/b.d.ts": "export {};",
        "dist/types/icons/c.d.mts": "export {};",
        "dist/types/shared.d.ts": "export {};",
      },
    );

    expect(declarationGraphOf(root).problems).toEqual([]);
    expect(relative(declarationGraphOf(root).files)).toEqual([
      path.join("dist", "types", "icons", "a.d.ts"),
      path.join("dist", "types", "icons", "nested", "b.d.ts"),
      path.join("dist", "types", "shared.d.ts"),
    ]);
  });

  test("fails on a pattern entry that matches nothing", () => {
    fixture(
      { "./icons/*": { types: "./dist/types/icons/*.d.ts" } },
      { "dist/types/other.d.ts": "export {};" },
    );

    expect(declarationGraphOf(root).problems).toEqual([
      `The "types" entry "./dist/types/icons/*.d.ts" matches no file.`,
    ]);
  });

  test("fails on a relative import it cannot resolve", () => {
    fixture(
      { ".": { types: "./dist/index.d.ts" } },
      { "dist/index.d.ts": `export * from "./missing";` },
    );

    expect(declarationGraphOf(root).problems).toEqual([
      `${path.join("dist", "index.d.ts")} imports "./missing", which resolves to no declaration file.`,
    ]);
  });

  test("resolves the declaration forms a consumer's compiler does", () => {
    fixture(
      { ".": { types: "./dist/index.d.ts" } },
      {
        "dist/index.d.ts": [
          `export * from "./js.js";`,
          `export * from "./esm.mjs";`,
          `export * from "./dir";`,
          `import styles from "./x.module.scss";`,
          `import data from "./data.json";`,
          `/// <reference path="./globals.d.ts" />`,
        ].join("\n"),
        "dist/js.d.ts": "export {};",
        "dist/esm.d.mts": "export {};",
        "dist/dir/index.d.ts": "export {};",
        "dist/x.module.d.scss.ts": "export {};",
        "dist/data.json": "{}",
        "dist/globals.d.ts": "export {};",
      },
    );

    const { files, problems } = declarationGraphOf(root);
    expect(problems).toEqual([]);
    expect(relative(files)).toEqual(
      [
        "dir/index.d.ts",
        "esm.d.mts",
        "globals.d.ts",
        "index.d.ts",
        "js.d.ts",
        "x.module.d.scss.ts",
      ].map((file) => path.join("dist", file)),
    );
  });

  test("fails on a reference path that does not exist", () => {
    fixture(
      { ".": { types: "./dist/index.d.ts" } },
      { "dist/index.d.ts": `/// <reference path="./globals.d.ts" />` },
    );

    expect(declarationGraphOf(root).problems).toEqual([
      `${path.join("dist", "index.d.ts")} references "./globals.d.ts", which does not exist.`,
    ]);
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

  test("accepts a reference to node, a declared package or its @types", () => {
    fixture({
      name: "pkg",
      exports: { ".": { types: "./dist/types/index.d.ts" } },
      dependencies: {
        declared: "1",
        undeclared: "1",
        vite: "1",
        "@types/scope__typed": "1",
      },
    });
    write(
      "dist/types/model/index.d.ts",
      [
        `/// <reference types="node" />`,
        `/// <reference types="vite/client" />`,
        `/// <reference types="@scope/typed" />`,
        `/// <reference types="missing" />`,
      ].join("\n"),
    );

    expect(findUndeclaredTypeImports(root)).toEqual([
      {
        file: path.join("dist", "types", "model", "index.d.ts"),
        packageName: "missing",
      },
    ]);
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

  test("fails on what it cannot resolve", () => {
    fixture(manifest, `export * from "./missing";`);

    expect(() => assertInstallableTypeImports(root)).toThrow(
      `${path.join("dist", "types", "index.d.ts")} imports "./missing", which resolves to no declaration file.`,
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
