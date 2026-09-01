import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { allEntries } from "../catalog/entries";

/**
 * What a consumer install can actually load.
 *
 * `files` ships `dist` and nothing else, and jscodeshift's worker `require()`s
 * the transform path. So the only thing that matters for a published run is
 * whether `dist` holds a CommonJS transform per codemod, loadable by `require`
 * with no babel and no type stripping involved.
 *
 * This is a build-output test on purpose. The unit tests run the `.ts` sources
 * through babel-register (cwd is inside the package there, so babel claims
 * them), which is exactly why the published package could ship transforms that
 * no consumer could load while every fixture test stayed green — the failure
 * this file exists to catch. `test:unit` depends on `build`, so `dist` is
 * current when it runs.
 */
const packageRoot = new URL("../../", import.meta.url);
const require = createRequire(import.meta.url);

const distPath = (relative: string): string =>
  fileURLToPath(new URL(`dist/${relative}`, packageRoot));

const codemodIds = allEntries
  .filter((entry) => entry.action === "codemod")
  .map((entry) => entry.id);

describe("the published package can load its transforms", () => {
  test("there is at least one codemod to check", () => {
    expect(codemodIds.length).toBeGreaterThan(0);
  });

  test.each(codemodIds)("%s is compiled into dist", (id) => {
    expect(existsSync(distPath(`migrations/${id}/transform.js`))).toBe(true);
  });

  test.each(codemodIds)("%s loads through require and is a function", (id) => {
    // `require`, not `import`: this is the call jscodeshift's worker makes, and
    // it is what fails when the output is ESM or the CommonJS marker is missing.
    const loaded = require(distPath(`migrations/${id}/transform.js`)) as {
      default?: unknown;
    };
    expect(typeof loaded.default).toBe("function");
  });

  test("to-remote-package is compiled too", () => {
    const path = distPath("tools/to-remote-package.js");
    expect(existsSync(path)).toBe(true);
    expect(typeof (require(path) as { default?: unknown }).default).toBe(
      "function",
    );
  });

  test.each(["migrations", "tools"])(
    "dist/%s is marked as CommonJS",
    (subtree) => {
      // Without this marker Node reads the emitted `.js` as ESM — the package is
      // `"type": "module"` — and the first line (`Object.defineProperty(exports,
      // …)`) throws `exports is not defined`.
      const marker = JSON.parse(
        readFileSync(distPath(`${subtree}/package.json`), "utf8"),
      ) as { type?: string };
      expect(marker.type).toBe("commonjs");
    },
  );

  test("no transform source is published", () => {
    // The `.ts` sources are the path that cannot work in a consumer install:
    // babel-register's `only` defaults to cwd, so a transform under the
    // consumer's `node_modules` falls through to Node's `.ts` handler, which
    // refuses with ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING. Keeping them out
    // of `files` makes that unreachable rather than merely deprioritised.
    const manifest = JSON.parse(
      readFileSync(fileURLToPath(new URL("package.json", packageRoot)), "utf8"),
    ) as { files?: string[] };
    expect(manifest.files).toEqual(["dist"]);
  });
});
