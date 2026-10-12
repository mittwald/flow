#!/usr/bin/env node
// @ts-check
// Enforce release-line routing for a pull request — see `routing-lib.mjs`.
//
// Usage: node .github/scripts/routing-guard.mjs
//   REPO        owner/name
//   PR_NUMBER   the pull request
//   PR_TITLE    its title
//   PR_BODY     its body (may be empty)
//   PR_COMMITS  its commit count, as GitHub reports it on the event
//   HEAD_REF    its head branch
//   HEAD_REPO   owner/name the head branch lives in
//   BASE_REF    its base branch

import { execFileSync } from "node:child_process";
import { isExemptPr, routingErrors } from "./routing-lib.mjs";

const {
  REPO,
  PR_NUMBER,
  PR_TITLE,
  PR_BODY,
  PR_COMMITS,
  HEAD_REF,
  HEAD_REPO,
  BASE_REF,
} = process.env;

if (
  !REPO ||
  !PR_NUMBER ||
  !PR_TITLE ||
  !PR_COMMITS ||
  !HEAD_REF ||
  !HEAD_REPO ||
  !BASE_REF
) {
  console.error(
    "::error::REPO, PR_NUMBER, PR_TITLE, PR_COMMITS, HEAD_REF, HEAD_REPO and BASE_REF are required.",
  );
  process.exit(1);
}

if (isExemptPr({ headRef: HEAD_REF, headRepo: HEAD_REPO, repo: REPO })) {
  console.log(
    `::notice::head='${HEAD_REF}' is a promotion/sync source — routing guard exempt.`,
  );
  process.exit(0);
}

// `/pulls/{n}/commits` lists only what the PR adds to its base, so a branch
// that merged its base into itself does not drag other PRs' commits along. A
// failure is fatal: "no commits" is exactly the gap this guard closes.
const commits = execFileSync(
  "gh",
  [
    "api",
    `repos/${REPO}/pulls/${PR_NUMBER}/commits`,
    "--paginate",
    "--jq",
    ".[] | {sha: .sha[0:9], message: .commit.message} | tojson",
  ],
  { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
)
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

// The endpoint stops at 250 commits, `--paginate` included. A partial list
// would still report "Routing OK", so a mismatch fails instead.
if (commits.length !== Number(PR_COMMITS)) {
  console.log(
    `::error::Read ${commits.length} of ${PR_COMMITS} commits — GitHub lists at most 250 per PR, so the rest cannot be checked. Split the PR, or squash the branch locally.`,
  );
  process.exit(1);
}

const errors = routingErrors({
  baseRef: BASE_REF,
  headRef: HEAD_REF,
  headRepo: HEAD_REPO,
  repo: REPO,
  title: PR_TITLE,
  body: PR_BODY ?? "",
  commits,
});

if (errors.length > 0) {
  for (const error of errors) console.log(`::error::${error}`);
  console.log(
    "::error::Routing: 'main' takes fix:/docs:/chore:/…; 'next' additionally takes feat:; breaking changes go to the major line.",
  );
  process.exit(1);
}

console.log(
  `Routing OK for base '${BASE_REF}' — title and ${commits.length} commit(s) checked.`,
);
