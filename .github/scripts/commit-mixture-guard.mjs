#!/usr/bin/env node
// @ts-check
/**
 * Commit-mixture guard — the IO shell around `commit-mixture-lib.mjs`.
 *
 * Reads the PR's commits on stdin as NUL-separated records, subject on the
 * first line and body on the rest:
 *
 *     git log -z --reverse --format=%s%n%b <base>..<head>
 *
 * `-z` rather than a textual delimiter, because a commit body can contain any
 * text but not a NUL. The PR title comes from `PR_TITLE`.
 *
 * Exits non-zero when the PR mixes release classes, or when its title does not
 * match the class its commits carry.
 */
import { readFileSync } from "node:fs";
import { classifyMixture } from "./commit-mixture-lib.mjs";

/** Read all of stdin; an unreadable stdin is an empty list. */
function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

const commits = readStdin()
  .split("\u0000")
  .filter((record) => record.trim() !== "")
  .map((record) => {
    const newline = record.indexOf("\n");
    return newline === -1
      ? { subject: record.trim(), body: "" }
      : {
          subject: record.slice(0, newline).trim(),
          body: record.slice(newline + 1),
        };
  });

const title = process.env.PR_TITLE ?? "";
const result = classifyMixture(commits, title);

console.log(
  `Title: ${title || "(empty)"} -> ${result.titleClass ?? "not conventional"}`,
);
console.log(`Commits (${commits.length}):`);
for (const commit of commits.slice(0, 30)) console.log(`  ${commit.subject}`);
if (commits.length > 30) console.log(`  ... and ${commits.length - 30} more`);

if (result.ok) {
  console.log(`::notice::Commit mixture is fine - ${result.reason}.`);
  process.exit(0);
}

for (const offender of result.offenders) {
  console.log(`::error::${offender.class}: ${offender.subject}`);
}
console.log(
  `::error::Invalid commit mixture - ${result.reason}. ` +
    "Split the pull request, or retitle it to the class its commits carry. " +
    "The squash merge keeps only the title.",
);
process.exit(1);
