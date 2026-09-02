#!/usr/bin/env node
// @ts-check
/**
 * Release-intent guard — the IO shell over `release-title-lib.mjs` and
 * `release-relevance-lib.mjs`.
 *
 * The TITLE decides whether a merge releases; the paths only verify that it
 * told the truth (#3023). Two callers, one comparison:
 *
 * - **`commit-guard.yml`** on a pull request, `MODE=check`. Exits non-zero when
 *   the PR title and the changed paths disagree, so a wrong title is a red
 *   check before the merge rather than a wrong release after it.
 * - **`publish.yml`** on a push, `MODE=decide`. Writes `publish=true|false` to
 *   `$GITHUB_OUTPUT` from the title — and exits non-zero on a disagreement
 *   instead of guessing. The release then waits for a human, visibly, rather
 *   than going the wrong way in silence. That is the one hole a PR check cannot
 *   close on its own: GitHub lets the merger edit the squash subject after
 *   every check has passed.
 *
 * Inputs: the subject in `SUBJECT`, the changed files on stdin (one
 * repository-relative path per line), and optionally the before/after snapshots
 * of every changed `package.json` under `MANIFEST_SNAPSHOT_DIR`.
 *
 * It never fails for lack of input. An empty or unreadable file list and an
 * unreadable subject both land on the fail-safe "publish", which is the
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
import { classifyTitle, reconcile } from "./release-title-lib.mjs";

const mode = process.env.MODE === "decide" ? "decide" : "check";
const subject = (process.env.SUBJECT ?? "").split("\n")[0];

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
 * One side of a manifest snapshot the workflow fetched, if it is there.
 *
 * A missing or unreadable file is `undefined`, which `classifyManifestChange`
 * reports as relevant — the behaviour before the refinement.
 */
function readManifestSide(dir, side, path) {
  try {
    return readFileSync(
      join(dir, side, `${path.replaceAll("/", "__")}.json`),
      "utf8",
    );
  } catch {
    return undefined;
  }
}

/**
 * Judge every changed `package.json` by its key diff, not by its path.
 *
 * The root manifest and each `packages/*` manifest go through the same
 * function; only the reason names which one. An `apps/*` manifest is already
 * irrelevant by path — refining it would only log a fail-safe line about a
 * snapshot the workflow never fetches.
 *
 * @type {{ manifestRelevance: Record<string, boolean> }}
 */
const options = { manifestRelevance: {} };
const snapshotDir = process.env.MANIFEST_SNAPSHOT_DIR;

for (const path of files.filter(
  (file) =>
    (file === "package.json" || file.endsWith("/package.json")) &&
    isPublishRelevant(file),
)) {
  const manifest = classifyManifestChange(
    snapshotDir ? readManifestSide(snapshotDir, "before", path) : undefined,
    snapshotDir ? readManifestSide(snapshotDir, "after", path) : undefined,
    path,
  );
  options.manifestRelevance[path] = manifest.relevant;
  console.log(`Manifest: ${manifest.reason}.`);
}

const paths = classifyChangedFiles(files, options);
const title = classifyTitle(subject);
const verdict = reconcile(title, paths.publish);

// Cap the log: a large merge lists hundreds of files and the first few already
// explain the decision.
const SAMPLE = 20;

console.log(`Title: ${subject || "(empty)"}`);
console.log(`  → ${title.reason}: ${title.publish ?? "cannot tell"}`);
console.log(`Paths: ${paths.reason}`);
if (!paths.publish) {
  console.log(
    `Changed files (${paths.total}), with the rule that cleared each:`,
  );
  for (const path of files.slice(0, SAMPLE)) {
    const rule =
      options.manifestRelevance[path] === false
        ? `manifest key diff "${path}"`
        : classifyPath(path).rule;
    console.log(`  ${path} — ${rule}`);
  }
  if (files.length > SAMPLE)
    console.log(`  … and ${files.length - SAMPLE} more`);
} else if (paths.relevant.length > 0) {
  console.log(`Files that reach a consumer (${paths.relevant.length}):`);
  for (const path of paths.relevant.slice(0, SAMPLE)) console.log(`  ${path}`);
  if (paths.relevant.length > SAMPLE) {
    console.log(`  … and ${paths.relevant.length - SAMPLE} more`);
  }
}

if (!verdict.agree) {
  const hint =
    mode === "check"
      ? "Fix the PR title and this check passes."
      : "Push a follow-up commit with a correct title, or dispatch `publish.yml` " +
        "manually. Nothing was published, and nothing was skipped silently.";
  console.log(
    `::error::The title and the changed paths disagree — ${verdict.reason}. ${hint}`,
  );
  process.exit(1);
}

const headline = verdict.publish ? "Releases" : "No release";
const tail = verdict.publish
  ? ""
  : " This push produces no npm publish, no version bump commit, no tag and no " +
    "GitHub Release. Dispatch `publish.yml` manually to release anyway.";
console.log(
  `::notice::${headline} — ${verdict.reason} (decided by the ${verdict.decidedBy}).${tail}`,
);

if (mode === "decide") {
  const out = process.env.GITHUB_OUTPUT;
  const line = `publish=${verdict.publish}\n`;
  if (out) appendFileSync(out, line);
  else process.stdout.write(line);
}
