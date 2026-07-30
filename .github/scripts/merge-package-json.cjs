// JSON-aware merge driver for `package.json` during the forward-merge cascade
// (ADR 0004 §3). When a lower release line is merged up into a higher one
// (`main → next`, `next → major line`), the two lines legitimately carry
// different `version` fields across ~15 `package.json` files. That divergence
// is mechanical noise, not a real conflict: the higher line keeps its own
// version (it is re-derived by `publish-next.yml` anyway), while every *other*
// change from the lower line (e.g. a genuine dependency bump) must still merge
// normally. A blanket `merge=ours` is wrong — it would silently drop those.
//
// git invokes a merge driver as configured in `.gitattributes` +
// `merge.package-json.driver`. This script is wired up as:
//   node .github/scripts/merge-package-json.cjs %O %A %B %L %P
//     %O = common-ancestor ("base") version of the file
//     %A = "our" version — the branch being merged INTO (e.g. `next`);
//          the merge RESULT must be written back here
//     %B = "their" version — the branch being merged IN (e.g. `main`)
//     %L = conflict marker length, %P = pathname (diagnostics only)
// The driver must exit 0 on a clean merge and non-zero to signal an unresolved
// conflict (which escalates to the sync PR — ADR 0004 §4).
//
// This is a `.cjs` on purpose: the repo's eslint config treats `**/*.cjs` as
// out-of-scope Node tooling, so no lint config is needed for it to pass the
// gate; `prettier` still formats it.

const { spawnSync } = require("node:child_process");
const { readFileSync, writeFileSync } = require("node:fs");

const [
  ,
  ,
  basePath,
  oursPath,
  theirsPath,
  markerSize = "7",
  pathName = "package.json",
] = process.argv;

function versionOf(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8")).version;
  } catch {
    return undefined;
  }
}

// The higher line's own version wins. If we cannot read it, fall back to a
// plain 3-way merge below (the version line then merges like any other).
const oursVersion = versionOf(oursPath);

// Normalise the top-level `version` string in all three inputs to our value, so
// a pure version divergence never produces a conflict and the merged result
// already carries the higher line's version. `prettier-plugin-pkgsort` keeps
// `version` near the top of every `package.json`, so the first match is the
// top-level field. Any *other* divergence is left untouched and merges below.
function normaliseVersion(file) {
  if (oursVersion === undefined) {
    return;
  }
  const raw = readFileSync(file, "utf8");
  const replaced = raw.replace(
    /("version"\s*:\s*)"[^"]*"/,
    `$1${JSON.stringify(oursVersion)}`,
  );
  writeFileSync(file, replaced);
}

for (const file of [basePath, oursPath, theirsPath]) {
  normaliseVersion(file);
}

// Line-based 3-way merge. `git merge-file` writes the result in place into
// `oursPath` and exits with the number of remaining conflict hunks (0 = clean),
// or a negative/large status on error.
const result = spawnSync(
  "git",
  [
    "merge-file",
    `--marker-size=${markerSize}`,
    "-L",
    "next (ours)",
    "-L",
    "base",
    "-L",
    "main (theirs)",
    oursPath,
    basePath,
    theirsPath,
  ],
  { stdio: "inherit" },
);

if (result.error || result.status === null) {
  console.error(
    `merge-package-json: git merge-file failed to run for ${pathName}`,
  );
  process.exit(1);
}

// status 0 → clean merge (exit 0); status > 0 → unresolved conflict hunks
// remain → signal a conflict so the workflow opens the sync PR (ADR 0004 §4).
process.exit(result.status === 0 ? 0 : 1);
