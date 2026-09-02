#!/usr/bin/env node
// @ts-check
/**
 * Release-intent guard — the IO shell over `release-title-lib.mjs` and
 * `release-relevance-lib.mjs`.
 *
 * The TITLE decides whether a merge releases (#3023). Three modes, one per
 * caller:
 *
 * - **`MODE=title`** — `publish.yml`, first. Reads `SUBJECT` only and writes
 *   either `publish=true|false` or `needs_paths=true`. When the title answers —
 *   the common case — the release job never fetches a file list at all.
 * - **`MODE=paths`** — `publish.yml`, only when the title cannot answer: a
 *   `chore(sync):` forward-merge, a Dependabot subject, an unparsable one.
 *   Classifies the changed files and writes `publish=`.
 * - **`MODE=check`** — `commit-guard.yml` on a pull request. Compares both and
 *   exits non-zero when they disagree, so a wrong title is a red check before
 *   the merge.
 *
 * Inputs: `SUBJECT`, the changed files on stdin (one repository-relative path
 * per line), and optionally the manifest snapshots under
 * `MANIFEST_SNAPSHOT_DIR` (see `fetch-manifest-snapshots.sh`).
 *
 * It never fails for lack of input: an unreadable subject or file list lands on
 * the fail-safe "publish", which is the behaviour before #2931.
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

const mode = process.env.MODE ?? "check";
const title = classifyTitle(process.env.SUBJECT ?? "");

/** @param {Record<string, string | boolean>} outputs */
function emit(outputs) {
  const lines = Object.entries(outputs)
    .map(([key, value]) => `${key}=${value}\n`)
    .join("");
  const out = process.env.GITHUB_OUTPUT;
  if (out) appendFileSync(out, lines);
  else process.stdout.write(lines);
}

console.log(`Title: ${process.env.SUBJECT?.split("\n")[0] || "(empty)"}`);
console.log(`  → ${title.reason}: ${title.publish ?? "cannot tell"}`);

if (mode === "title") {
  if (title.publish === undefined) {
    console.log(
      "::notice::The title cannot answer — the changed paths decide.",
    );
    emit({ needs_paths: true });
  } else {
    const tail = title.publish
      ? ""
      : " No npm publish, no version bump commit, no tag, no GitHub Release. " +
        "Dispatch `publish.yml` manually to release anyway.";
    console.log(
      `::notice::${title.publish ? "Releases" : "No release"} — ${title.reason}.${tail}`,
    );
    emit({ publish: title.publish, needs_paths: false });
  }
  process.exit(0);
}

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

/** One side of a manifest snapshot, if the caller fetched it. */
function readManifestSide(dir, side, path) {
  try {
    const file = join(dir, side, `${path.replaceAll("/", "__")}.json`);
    return readFileSync(file, "utf8");
  } catch {
    return undefined;
  }
}

/**
 * Judge every changed `package.json` by its key diff, not by its path — for
 * those the path carries no information (#2970, #3023).
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

// Cap the log: a large merge lists hundreds of files, and the first few already
// explain the answer.
const SAMPLE = 20;

console.log(`Paths: ${paths.reason}`);
if (paths.publish) {
  for (const path of paths.relevant.slice(0, SAMPLE)) {
    console.log(`  ${path} — reaches a consumer`);
  }
} else {
  for (const path of files.slice(0, SAMPLE)) {
    const rule =
      options.manifestRelevance[path] === false
        ? `manifest key diff "${path}"`
        : classifyPath(path).rule;
    console.log(`  ${path} — ${rule}`);
  }
}
const shown = paths.publish ? paths.relevant.length : files.length;
if (shown > SAMPLE) console.log(`  … and ${shown - SAMPLE} more`);

if (mode === "paths") {
  console.log(
    `::notice::${paths.publish ? "Releases" : "No release"} — ${paths.reason}.`,
  );
  emit({ publish: paths.publish });
  process.exit(0);
}

const verdict = reconcile(title, paths.publish);

if (!verdict.agree) {
  console.log(
    `::error::The title and the changed paths disagree — ${verdict.reason}. ` +
      "Fix the PR title and this check passes.",
  );
  process.exit(1);
}

console.log(
  `::notice::${verdict.publish ? "Releases" : "No release"} — ${verdict.reason} ` +
    `(decided by the ${verdict.decidedBy}).`,
);
