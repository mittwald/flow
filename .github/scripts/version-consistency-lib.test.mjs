// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  globToRegExp,
  isLernaPackageDir,
  collectMismatches,
} from "./version-consistency-lib.mjs";

test("globToRegExp: `*` is one segment, `**` is any number", () => {
  assert.ok(globToRegExp("packages/*").test("packages/components"));
  assert.ok(!globToRegExp("packages/*").test("packages/a/b"));
  assert.ok(!globToRegExp("packages/*").test("apps/docs"));
  assert.ok(globToRegExp("packages/**").test("packages/a/b"));
});

test("isLernaPackageDir: only the managed directories match", () => {
  const patterns = ["packages/*"];
  assert.ok(isLernaPackageDir("packages/codemods", patterns));
  assert.ok(!isLernaPackageDir("apps/docs", patterns));
  assert.ok(!isLernaPackageDir(".", patterns)); // the root manifest
  assert.ok(!isLernaPackageDir("packages/components/node_modules/x", patterns));
});

test("collectMismatches: agreement is silent", () => {
  assert.deepEqual(
    collectMismatches("1.0.2", [
      { path: "packages/a/package.json", version: "1.0.2" },
      { path: "packages/b/package.json", version: "1.0.2" },
    ]),
    [],
  );
});

test("collectMismatches: a package left behind by a merge is reported", () => {
  assert.deepEqual(
    collectMismatches("1.0.2", [
      { path: "packages/a/package.json", version: "1.0.2" },
      { path: "packages/codemods/package.json", version: "1.0.1" },
    ]),
    [
      {
        path: "packages/codemods/package.json",
        version: "1.0.1",
        expected: "1.0.2",
      },
    ],
  );
});

test("collectMismatches: a missing version is a mismatch, not a pass", () => {
  assert.deepEqual(
    collectMismatches("1.0.2", [
      { path: "packages/a/package.json", version: undefined },
    ]),
    [{ path: "packages/a/package.json", version: "(none)", expected: "1.0.2" }],
  );
});
