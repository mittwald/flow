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
 *
 * `--fix` writes the fix instead of describing it. CI never passes it: a guard
 * that repairs the tree it is checking reports green on something nobody
 * reviewed, and a commit pushed by a bot does not run the checks again anyway.
 * It is for the person or agent reading the failure — most often on a
 * long-lived branch that adds a package, which no forward-merge can bump
 * because the release never saw it.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  isLernaPackageDir,
  planFix,
  withVersion,
} from "./version-consistency-lib.mjs";

const shouldFix = process.argv.includes("--fix");

const lerna = JSON.parse(readFileSync("lerna.json", "utf8"));
const patterns = lerna.packages ?? ["packages/*"];

if (typeof lerna.version !== "string") {
  console.error("::error::lerna.json has no top-level `version`.");
  process.exit(2);
}

// A git pathspec wildcard matches across `/` (fnmatch without FNM_PATHNAME),
// so `*package.json` finds every manifest at any depth, not just the root one.
// The `endsWith` below then drops the root manifest, which is not a package.
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

const plan = planFix(lerna.version, manifests);

if (plan.kind === "refuse") {
  console.error(`::error::Version consistency: ${plan.reason}`);
  process.exit(1);
}

const { mismatches } = plan;

if (mismatches.length === 0) {
  console.log(
    `Version consistency OK — all ${manifests.length} managed package(s) are at ${lerna.version}.`,
  );
  process.exit(0);
}

if (shouldFix) {
  for (const { path, version, expected } of mismatches) {
    writeFileSync(path, withVersion(readFileSync(path, "utf8"), expected));
    console.log(`${path}: ${version} → ${expected}`);
  }
  console.log(
    `Set ${mismatches.length} manifest(s) to ${lerna.version}. Review the diff and commit.`,
  );
  process.exit(0);
}

for (const { path, version, expected } of mismatches) {
  console.log(`::error file=${path}::${version} — lerna.json says ${expected}`);
}

console.error(
  "::error::Version consistency: a Lerna-managed package disagrees with `lerna.json`. " +
    "This is usually a merge that could not carry a release bump to a package the " +
    "release never saw. Run `node .github/scripts/version-consistency-guard.mjs --fix` " +
    `to set the version(s) above to ${lerna.version}, then commit.`,
);
process.exit(1);
