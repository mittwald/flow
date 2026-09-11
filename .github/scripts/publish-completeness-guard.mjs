#!/usr/bin/env node
// @ts-check
/**
 * Publish-completeness guard — fs/network shell around
 * publish-completeness-lib.mjs.
 *
 * Fails (exit 1) when a publishable package does NOT resolve on the registry at
 * the version this release shipped. Runs as the last step of `publish.yml`,
 * after the push, the tag and the GitHub release — deliberately: `only_publish`
 * (the remedy) publishes whatever the checked-out branch's manifests say, so
 * failing before the push would leave the branch at N-1 while npm carries N,
 * and the remedy would republish the wrong version.
 *
 * Exit codes: 0 complete · 1 hole, unverifiable or out of lockstep · 2 the
 * guard could not run (bad `lerna.json`, no packages matched).
 */
import { appendFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { isLernaPackageDir } from "./version-consistency-lib.mjs";
import {
  backoffDelays,
  classifyStatus,
  collectOutOfLockstep,
  collectPublishable,
  renderReport,
  verdict,
} from "./publish-completeness-lib.mjs";

const registry = (
  process.env.NPM_REGISTRY ?? "https://registry.npmjs.org"
).replace(/\/+$/, "");

const lerna = JSON.parse(readFileSync("lerna.json", "utf8"));
const patterns = lerna.packages ?? ["packages/*"];

if (typeof lerna.version !== "string") {
  console.error("::error::lerna.json has no top-level `version`.");
  process.exit(2);
}

// Same pathspec trick as version-consistency-guard.mjs: a git wildcard matches
// across `/`, so `*package.json` finds every manifest at any depth; `endsWith`
// then drops the root manifest, which is not a package.
const entries = execFileSync("git", ["ls-files", "*package.json"], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
})
  .split("\n")
  .map((line) => line.trim())
  .filter((path) => path.endsWith("/package.json"))
  .filter((path) => isLernaPackageDir(dirname(path), patterns))
  .map((path) => ({ path, manifest: JSON.parse(readFileSync(path, "utf8")) }));

const publishable = collectPublishable(entries);

if (publishable.length === 0) {
  console.error(
    `::error::No publishable package matched the lerna.json globs (${patterns.join(", ")}).`,
  );
  process.exit(2);
}

/**
 * One registry lookup against the exact-version endpoint: 200 the version
 * exists, 404 it does not. Anything else says nothing — see `classifyStatus`.
 *
 * @param {{ name: string; version: string }} pkg
 */
async function probe(pkg) {
  const url = `${registry}/${encodeURIComponent(pkg.name)}/${encodeURIComponent(pkg.version)}`;
  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    return {
      presence: classifyStatus(response.status),
      detail: `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      presence: classifyStatus(0),
      detail: error instanceof Error ? error.message : "request failed",
    };
  }
}

const outOfLockstep = collectOutOfLockstep(lerna.version, publishable);
for (const pkg of outOfLockstep) {
  console.log(
    `::error file=${pkg.path}::${pkg.name} is at ${pkg.version} — lerna.json says ${lerna.version}`,
  );
}

/** @type {Map<string, import("./publish-completeness-lib.mjs").Result>} */
const seen = new Map();
const delays = backoffDelays();
let outstanding = publishable;

for (let attempt = 0; ; attempt++) {
  const probed = await Promise.all(
    outstanding.map(async (pkg) => ({ pkg, ...(await probe(pkg)) })),
  );

  for (const { pkg, presence, detail } of probed) {
    seen.set(pkg.name, {
      name: pkg.name,
      version: pkg.version,
      presence,
      detail,
    });
  }

  outstanding = probed
    .filter(({ presence }) => presence !== "present")
    .map(({ pkg }) => pkg);

  if (outstanding.length === 0 || attempt >= delays.length) break;

  const names = outstanding.map((pkg) => pkg.name).join(", ");
  console.log(
    `${outstanding.length} package(s) not visible yet, re-checking in ${delays[attempt] / 1000}s: ${names}`,
  );
  await sleep(delays[attempt]);
}

const results = publishable.map(
  (pkg) =>
    /** @type {import("./publish-completeness-lib.mjs").Result} */ (
      seen.get(pkg.name)
    ),
);
const report = renderReport(lerna.version, results);

console.log(report);

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
}

const { ok, missing, unknown } = verdict(results);

for (const result of missing) {
  console.log(
    `::error::${result.name}@${result.version} is not on the registry — the publish reported success without shipping it.`,
  );
}

for (const result of unknown) {
  console.log(
    `::warning::${result.name}@${result.version} could not be verified (${result.detail}).`,
  );
}

if (ok && outOfLockstep.length === 0) {
  console.log(
    `Publish completeness OK — all ${results.length} package(s) resolve at ${lerna.version}.`,
  );
  process.exit(0);
}

if (missing.length > 0) {
  console.error(
    "::error::Incomplete release: a package was versioned, tagged and released but never reached npm. " +
      "`workspace:*` packs as an EXACT pin, so the packages that DID publish can now demand a version " +
      "that does not exist. Heal it by dispatching this workflow on the affected line with " +
      "`only_publish: true` — it republishes exactly the missing packages, with no version bump.",
  );
}

if (unknown.length > 0 && missing.length === 0) {
  console.error(
    "::error::Could not verify the release against the registry after the full retry budget. " +
      "This is not proof of a hole — re-run this job before republishing anything.",
  );
}

process.exit(1);
