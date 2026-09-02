#!/usr/bin/env node
// @ts-check
/**
 * Release-relevance guard — IO shell around release-relevance-lib.mjs.
 *
 * Reads the changed-file list on stdin (one repository-relative path per line)
 * and writes `publish=true|false` to $GITHUB_OUTPUT.
 *
 * `MANIFEST_SNAPSHOT_DIR` optionally points at a directory holding both
 * versions of every changed `package.json` the workflow fetched, as
 * `<dir>/before/<slug>.json` and `<dir>/after/<slug>.json` with the path's `/`
 * replaced by `__`. They let the classifier judge a manifest by its key diff
 * instead of its path (#2970, #3023); a missing snapshot leaves that manifest
 * relevant, as before.
 *
 * It never fails the run. The decision is a routing choice, not a policy
 * violation: an empty or unreadable input yields `publish=true`, which is the
 * behaviour before #2931.
 */
import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  classifyChangedFiles,
  classifyManifestChange,
  classifyPath,
  isPublishRelevant,
} from "./release-relevance-lib.mjs";

/** Read all of stdin; an unreadable stdin is an empty list (fail-safe). */
function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

const files = readStdin()
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line !== "");

/**
 * One fetched side of one manifest, or `undefined` when it is not there.
 *
 * A missing or unreadable file makes `classifyManifestChange` report the
 * manifest as relevant — the behaviour before this refinement. A manifest that
 * was ADDED or DELETED has only one side, and that is exactly the case where
 * the fail-safe default is what we want.
 *
 * @param {string} dir
 * @param {"before" | "after"} side
 * @param {string} path
 */
function readManifestSide(dir, side, path) {
  const file = join(dir, side, `${path.replaceAll("/", "__")}.json`);
  try {
    return readFileSync(file, "utf8");
  } catch {
    return undefined;
  }
}

/**
 * Judge every changed `package.json` by its key diff, not by its path.
 *
 * The root manifest and each `packages/*` manifest go through the same
 * function; only the reason names which one.
 *
 * @type {{ manifestRelevance: Record<string, boolean> }}
 */
const options = { manifestRelevance: {} };
const snapshotDir = process.env.MANIFEST_SNAPSHOT_DIR;
const manifests = files.filter(
  (path) =>
    (path === "package.json" || path.endsWith("/package.json")) &&
    // An `apps/*` manifest is already irrelevant by path — refining it would
    // only log a fail-safe line about a snapshot the workflow never fetches.
    isPublishRelevant(path),
);

for (const path of manifests) {
  const manifest = classifyManifestChange(
    snapshotDir ? readManifestSide(snapshotDir, "before", path) : undefined,
    snapshotDir ? readManifestSide(snapshotDir, "after", path) : undefined,
    path,
  );
  options.manifestRelevance[path] = manifest.relevant;
  console.log(`Manifest: ${manifest.reason}.`);
}

const { publish, reason, relevant, total } = classifyChangedFiles(
  files,
  options,
);

// Cap the log: a large merge lists hundreds of files and the first few already
// explain the decision.
const SAMPLE = 20;

if (publish) {
  // `relevant` is empty on the fail-safe paths (unreadable file list), where
  // "publishable change" would overstate what we actually know.
  const headline = relevant.length > 0 ? "Publishable change" : "Publishing";
  console.log(`::notice::${headline} — ${reason}.`);
  if (relevant.length > 0) {
    console.log(`Files that reach a published package (${relevant.length}):`);
    for (const path of relevant.slice(0, SAMPLE)) console.log(`  ${path}`);
    if (relevant.length > SAMPLE) {
      console.log(`  … and ${relevant.length - SAMPLE} more`);
    }
  }
} else {
  console.log(
    `::notice::No publishable change — ${reason}. ` +
      "This push produces no npm publish, no version bump commit, no tag and " +
      "no GitHub Release. Dispatch this workflow manually to publish anyway.",
  );
  console.log(`Changed files (${total}), with the rule that cleared each:`);
  for (const path of files.slice(0, SAMPLE)) {
    const rule =
      options.manifestRelevance[path] === false
        ? `manifest key diff "${path}"`
        : classifyPath(path).rule;
    console.log(`  ${path} — ${rule}`);
  }
  if (files.length > SAMPLE) {
    console.log(`  … and ${files.length - SAMPLE} more`);
  }
}

const out = process.env.GITHUB_OUTPUT;
const line = `publish=${publish}\n`;
if (out) appendFileSync(out, line);
else process.stdout.write(line);
