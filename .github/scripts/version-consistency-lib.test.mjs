// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  globToRegExp,
  isLernaPackageDir,
  collectMismatches,
  planFix,
  withVersion,
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

test("planFix: a package the release could not reach is written", () => {
  const plan = planFix("1.2.0", [
    { path: "packages/a/package.json", version: "1.2.0" },
    { path: "packages/new/package.json", version: "1.1.0" },
  ]);

  assert.equal(plan.kind, "write");
  assert.deepEqual(plan.kind === "write" ? plan.mismatches : [], [
    {
      path: "packages/new/package.json",
      version: "1.1.0",
      expected: "1.2.0",
    },
  ]);
});

/*
 * The one shape where writing is the wrong direction, and it looks identical
 * from any single manifest: the file left behind is `lerna.json`, and setting
 * the packages to it would undo a release.
 */
test("planFix: lerna.json alone against every package is refused", () => {
  const plan = planFix("1.2.0", [
    { path: "packages/a/package.json", version: "1.1.0" },
    { path: "packages/b/package.json", version: "1.1.0" },
  ]);

  assert.equal(plan.kind, "refuse");
  assert.match(plan.kind === "refuse" ? plan.reason : "", /undo a release/);
});

test("planFix: packages that disagree with each other are written", () => {
  const plan = planFix("1.2.0", [
    { path: "packages/a/package.json", version: "1.1.0" },
    { path: "packages/b/package.json", version: "1.0.0" },
  ]);

  assert.equal(plan.kind, "write");
  assert.equal(plan.kind === "write" ? plan.mismatches.length : 0, 2);
});

test("planFix: agreement needs no plan", () => {
  const plan = planFix("1.2.0", [
    { path: "packages/a/package.json", version: "1.2.0" },
  ]);

  assert.equal(plan.kind, "write");
  assert.deepEqual(plan.kind === "write" ? plan.mismatches : null, []);
});

test("withVersion: replaces the version and nothing else", () => {
  const manifest = [
    "{",
    '  "name": "@mittwald/flow-x",',
    '  "version": "1.1.0",',
    '  "dependencies": {',
    '    "version": "2.0.0"',
    "  }",
    "}",
    "",
  ].join("\n");

  assert.equal(
    withVersion(manifest, "1.2.0"),
    manifest.replace('"version": "1.1.0"', '"version": "1.2.0"'),
  );
});

test("withVersion: a manifest without a version is an error, not a silent no-op", () => {
  assert.throws(() => withVersion('{\n  "name": "x"\n}\n', "1.2.0"));
});
