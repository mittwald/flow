#!/usr/bin/env node
// @ts-check
/**
 * Version-consistency guard — git-IO shell around version-consistency-lib.mjs.
 *
 * Fails (exit 1) when a package managed by Lerna-Lite carries a `version` that
 * disagrees with `lerna.json`. The failure it exists to catch is silent by
 * construction: a merge (or a half-finished `lerna version`) leaves one
 * manifest behind while every other package moved, with no conflict markers and
 * a `CHANGELOG.md` that already lists the new release.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  collectMismatches,
  isLernaPackageDir,
} from "./version-consistency-lib.mjs";

const lerna = JSON.parse(readFileSync("lerna.json", "utf8"));
const patterns = lerna.packages ?? ["packages/*"];

if (typeof lerna.version !== "string") {
  console.error("::error::lerna.json has no top-level `version`.");
  process.exit(2);
}

const manifests = execFileSync("git", ["ls-files", "*package.json"], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
})
  .split("\n")
  .map((line) => line.trim())
  .filter((path) => path.endsWith("/package.json"))
  .filter((path) => isLernaPackageDir(dirname(path), patterns))
  .map((path) => ({
    path,
    version: JSON.parse(readFileSync(path, "utf8")).version,
  }));

if (manifests.length === 0) {
  console.error(
    `::error::No package manifests matched the lerna.json globs (${patterns.join(", ")}).`,
  );
  process.exit(2);
}

const mismatches = collectMismatches(lerna.version, manifests);

if (mismatches.length === 0) {
  console.log(
    `Version consistency OK — all ${manifests.length} managed package(s) are at ${lerna.version}.`,
  );
  process.exit(0);
}

for (const { path, version, expected } of mismatches) {
  console.log(`::error file=${path}::${version} — lerna.json says ${expected}`);
}

console.error(
  "::error::Version consistency: a Lerna-managed package disagrees with `lerna.json`. " +
    "This is usually a merge that reverted a release bump — set the version(s) above to " +
    `${lerna.version} and commit.`,
);
process.exit(1);
