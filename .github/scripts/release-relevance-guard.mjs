#!/usr/bin/env node
// @ts-check
/**
 * Release-relevance guard — IO shell around release-relevance-lib.mjs.
 *
 * Reads the changed-file list on stdin (one repository-relative path per line)
 * and writes `publish=true|false` to $GITHUB_OUTPUT.
 *
 * `MANIFEST_DIR` optionally points at a directory holding the two versions of
 * every changed `package.json`, as `<path with / replaced by __>.before.json`
 * and `.after.json`. They let the classifier judge each manifest by its key
 * diff instead of its path (#2970, #3023); a manifest whose pair is missing
 * stays relevant, as before.
 *
 * It never fails the run. The decision is a routing choice, not a policy
 * violation: an empty or unreadable input yields `publish=true`, which is the
 * behaviour before #2931.
 */
import { appendFileSync, readFileSync } from "node:fs";
import {
  classifyChangedFiles,
  classifyPackageManifestChange,
  classifyRootManifestChange,
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
 * One side of a manifest the workflow fetched, if it is there.
 *
 * A missing or unreadable file is `undefined`, which the classifiers report as
 * relevant — the behaviour before this refinement.
 *
 * @param {string} path
 */
function readManifest(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return undefined;
  }
}

/** @type {{ manifestRelevance: Record<string, boolean> }} */
const options = { manifestRelevance: {} };
const manifestDir = process.env.MANIFEST_DIR;

for (const path of files.filter(
  (file) => file === "package.json" || file.endsWith("/package.json"),
)) {
  const slug = path.replaceAll("/", "__");
  const before = manifestDir
    ? readManifest(`${manifestDir}/${slug}.before.json`)
    : undefined;
  const after = manifestDir
    ? readManifest(`${manifestDir}/${slug}.after.json`)
    : undefined;

  const { relevant, reason } =
    path === "package.json"
      ? classifyRootManifestChange(before, after)
      : classifyPackageManifestChange(before, after, path);

  options.manifestRelevance[path] = relevant;
  console.log(`Manifest: ${reason}.`);
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
  console.log(`Changed files (${total}):`);
  for (const path of files.slice(0, SAMPLE)) console.log(`  ${path}`);
  if (files.length > SAMPLE) {
    console.log(`  … and ${files.length - SAMPLE} more`);
  }
}

const out = process.env.GITHUB_OUTPUT;
const line = `publish=${publish}\n`;
if (out) appendFileSync(out, line);
else process.stdout.write(line);
