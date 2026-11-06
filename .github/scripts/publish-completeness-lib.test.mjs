// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  backoffDelays,
  classifyStatus,
  collectOutOfLockstep,
  collectPublishable,
  renderReport,
  verdict,
} from "./publish-completeness-lib.mjs";

/**
 * @param {string} name
 * @param {string} version
 * @param {import("./publish-completeness-lib.mjs").Presence} presence
 * @returns {import("./publish-completeness-lib.mjs").Result}
 */
const result = (name, version, presence) => ({ name, version, presence });

test("collectPublishable: private packages are not expected on npm", () => {
  assert.deepEqual(
    collectPublishable([
      {
        path: "packages/a/package.json",
        manifest: { name: "@scope/a", version: "1.0.0" },
      },
      {
        path: "packages/core/package.json",
        manifest: { name: "core", version: "1.0.0", private: true },
      },
    ]),
    [{ path: "packages/a/package.json", name: "@scope/a", version: "1.0.0" }],
  );
});

test("collectPublishable: `private` is truthy, as lerna reads it", () => {
  // packages/core declares the STRING "true". lerna-lite's `Package.private` is
  // `Boolean(manifest.private)`, so it never publishes it — and neither may the
  // guard expect it on npm.
  const publishable = collectPublishable([
    {
      path: "packages/core/package.json",
      manifest: {
        name: "@mittwald/flow-core",
        version: "1.1.31",
        private: "true",
      },
    },
    {
      path: "packages/a/package.json",
      manifest: { name: "@scope/a", version: "1.1.31", private: false },
    },
  ]);
  assert.deepEqual(
    publishable.map((pkg) => pkg.name),
    ["@scope/a"],
  );
});

test("collectPublishable: a manifest without name or version is skipped", () => {
  const publishable = collectPublishable([
    {
      path: "packages/a/package.json",
      manifest: { name: "@scope/a", version: "1.0.0" },
    },
    { path: "packages/b/package.json", manifest: { name: "@scope/b" } },
    { path: "packages/c/package.json", manifest: { version: "1.0.0" } },
  ]);
  assert.deepEqual(
    publishable.map((pkg) => pkg.name),
    ["@scope/a"],
  );
});

test("collectOutOfLockstep: fixed versioning means every manifest matches lerna.json", () => {
  const publishable = [
    { path: "packages/a/package.json", name: "@scope/a", version: "1.1.31" },
    { path: "packages/b/package.json", name: "@scope/b", version: "1.1.30" },
  ];
  assert.deepEqual(collectOutOfLockstep("1.1.31", publishable), [
    publishable[1],
  ]);
  assert.deepEqual(collectOutOfLockstep("1.1.30", [publishable[1]]), []);
});

test("classifyStatus: only 404 proves absence", () => {
  assert.equal(classifyStatus(200), "present");
  assert.equal(classifyStatus(404), "missing");
  // A registry that errors, rate-limits or never answers says NOTHING about the
  // version — reporting that as a hole sends someone republishing a complete
  // release.
  assert.equal(classifyStatus(500), "unknown");
  assert.equal(classifyStatus(429), "unknown");
  assert.equal(classifyStatus(0), "unknown");
});

test("backoffDelays: the budget outlasts registry propagation", () => {
  const delays = backoffDelays();
  assert.ok(delays.length >= 5, "too few attempts to ride out a slow CDN");
  // Measured: a package can stay 404 for minutes after its own publish.
  const total = delays.reduce((sum, delay) => sum + delay, 0);
  assert.ok(total >= 300_000, `budget is only ${total}ms`);
  assert.deepEqual(
    [...delays].sort((a, b) => a - b),
    delays,
    "delays must grow, not thrash the registry",
  );
});

test("verdict: a complete release is ok", () => {
  const results = [
    result("@scope/a", "1.1.31", "present"),
    result("@scope/b", "1.1.31", "present"),
  ];
  assert.deepEqual(verdict(results), { ok: true, missing: [], unknown: [] });
});

test("verdict: one missing package fails the run", () => {
  // The 1.1.31 shape: 10 of 13 published, the run green (#2887).
  const results = [
    result("@scope/a", "1.1.31", "present"),
    result("@scope/b", "1.1.31", "missing"),
  ];
  const { ok, missing, unknown } = verdict(results);
  assert.equal(ok, false);
  assert.deepEqual(
    missing.map((r) => r.name),
    ["@scope/b"],
  );
  assert.deepEqual(unknown, []);
});

test("verdict: unverifiable is its own outcome, not a hole", () => {
  const results = [result("@scope/a", "1.1.31", "unknown")];
  const { ok, missing, unknown } = verdict(results);
  assert.equal(ok, false);
  assert.deepEqual(missing, []);
  assert.deepEqual(
    unknown.map((r) => r.name),
    ["@scope/a"],
  );
});

test("renderReport: names the missing package and the version asked for", () => {
  const report = renderReport("1.1.31", [
    result("@mittwald/flow-react-components", "1.1.31", "present"),
    result("@mittwald/flow-remote-elements", "1.1.31", "missing"),
  ]);
  assert.match(report, /1 missing, 0 unverifiable of 2 publishable/);
  assert.match(report, /`@mittwald\/flow-remote-elements` \| 1\.1\.31/);
  assert.match(report, /^\| --- \| --- \| --- \| --- \|$/m);
});

test("renderReport: a complete release says so, under the release's heading", () => {
  const report = renderReport("1.1.31", [
    result("@scope/a", "1.1.31", "present"),
  ]);
  assert.match(report, /^### Publish completeness — 1\.1\.31$/m);
  assert.match(
    report,
    /All 1 publishable package\(s\) resolve on the registry\./,
  );
});

test("renderReport: the headline never claims a version the rows contradict", () => {
  // A manifest out of lockstep is checked at ITS version, not lerna.json's.
  const report = renderReport("1.1.31", [
    result("@scope/a", "1.1.30", "present"),
  ]);
  assert.doesNotMatch(report, /resolve at 1\.1\.31/);
  assert.match(report, /\| 1\.1\.30 \|/);
});
