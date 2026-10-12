#!/usr/bin/env node
// @ts-check
// Close the issues a merged pull request says it closes, on a standing line
// that is not the default branch.
//
// Called from `close-linked-issues.yml` after a PR merges into `next`. GitHub
// resolves `Closes #123` only on the DEFAULT branch, so on `next` the keyword
// is read, the link is shown, and nothing happens — see
// `close-linked-issues-lib.mjs` for the full reasoning and the contract.
//
// Every decision is logged: what was found, what was closed, and what was
// skipped and why. A run that closes nothing is the normal case and says so.
//
// Usage: node .github/scripts/close-linked-issues.mjs
//   REPO       owner/name
//   PR_NUMBER  the merged pull request
//   PR_BODY    its body (may be empty)
//   BASE_REF   the branch it merged into

import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { collectClosingReferences } from "./close-linked-issues-lib.mjs";

const { REPO, PR_NUMBER, PR_BODY, BASE_REF, GITHUB_STEP_SUMMARY } = process.env;

if (!REPO || !PR_NUMBER || !BASE_REF) {
  console.error("::error::REPO, PR_NUMBER and BASE_REF are required.");
  process.exit(1);
}

/**
 * @param {string[]} args
 * @returns {string}
 */
const gh = (args) =>
  execFileSync("gh", args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });

/** @type {string[]} */
const summary = [];
const note = (/** @type {string} */ line) => {
  console.log(line);
  summary.push(line);
};

// The PR's own commits, which is the half GitHub would have resolved from the
// push to the default branch. `/pulls/{n}/commits` excludes everything already
// on the base, so a branch that merged `next` into itself does not drag other
// pull requests' keywords along.
//
// A failure here is not fatal: the body alone still carries the intent in
// almost every case, and closing from it beats closing nothing.
/** @type {string[]} */
let commitMessages = [];
try {
  commitMessages = gh([
    "api",
    `repos/${REPO}/pulls/${PR_NUMBER}/commits`,
    "--paginate",
    "--jq",
    ".[].commit.message",
  ])
    .split("\n")
    .filter(Boolean);
} catch {
  console.log(
    `::warning::Could not read the commits of #${PR_NUMBER} — parsing the body only.`,
  );
}

const { own, foreign } = collectClosingReferences({
  body: PR_BODY,
  commitMessages,
  repo: REPO,
});

for (const reference of foreign) {
  note(`Ignored \`${reference}\` — this workflow only closes ${REPO} issues.`);
}

if (own.length === 0) {
  note(`#${PR_NUMBER} references no issue to close.`);
} else {
  note(`#${PR_NUMBER} closes: ${own.map((n) => `#${n}`).join(", ")}`);
}

const comment = [
  `Closed by #${PR_NUMBER}, merged into \`${BASE_REF}\`.`,
  "",
  `\`${BASE_REF}\` is not the default branch, so GitHub's own \`Closes #…\` ` +
    "handling never fires there — this comment is that handling. The change " +
    "reaches `main` with the next promotion.",
].join("\n");

let failed = 0;

for (const number of own) {
  /** @type {{ state: string; title: string; isPullRequest: boolean }} */
  let issue;

  try {
    const [state, title, pullRequest] = gh([
      "api",
      `repos/${REPO}/issues/${number}`,
      "--jq",
      ".state, .title, (.pull_request != null)",
    ]).split("\n");
    issue = {
      state: state ?? "",
      title: title ?? "",
      isPullRequest: pullRequest === "true",
    };
  } catch {
    // A number that resolves to nothing is a typo in the body, not a failure
    // of this run — there is no issue to close and nothing to repair.
    note(`- #${number}: does not exist — skipped.`);
    continue;
  }

  // `#123` is the same notation for issues and pull requests, and `Fixes #123`
  // pointing at a PR is a legitimate thing to write. Closing that PR is not.
  if (issue.isPullRequest) {
    note(`- #${number}: is a pull request, not an issue — skipped.`);
    continue;
  }

  if (issue.state !== "open") {
    note(`- #${number}: already closed — skipped.`);
    continue;
  }

  try {
    gh([
      "issue",
      "close",
      String(number),
      "--repo",
      REPO,
      "--reason",
      "completed",
      "--comment",
      comment,
    ]);
    note(`- #${number}: closed — ${issue.title}`);
  } catch (error) {
    failed++;
    console.log(
      `::error::Could not close #${number}: ${error instanceof Error ? error.message : error}`,
    );
    note(`- #${number}: **could not be closed** — close it by hand.`);
  }
}

if (GITHUB_STEP_SUMMARY) {
  appendFileSync(
    GITHUB_STEP_SUMMARY,
    `### Linked issues\n\n${summary.join("\n")}\n`,
  );
}

if (failed > 0) {
  console.error(
    `::error::${failed} issue(s) referenced by #${PR_NUMBER} could not be closed.`,
  );
  process.exit(1);
}
