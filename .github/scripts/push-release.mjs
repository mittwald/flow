#!/usr/bin/env node
// Advance a standing release line (`main` / `next`) to the release commit and
// place its tag — tolerating a merge that landed on that line while this run
// was building and publishing.
//
// Called only AFTER `lerna publish` succeeded, from `publish.yml`. At that
// point npm already has the version, so this push is the last thing standing
// between a published release and a consistent repository. It must not fail on
// a non-fast-forward.
//
// WHY THE WORKFLOW'S `concurrency` GROUP DOES NOT COVER THIS
// `mutate-main` / `mutate-next` serialize workflow RUNS against each other. A
// pull request merged through the GitHub UI is not a run, so it can land in the
// ~10 minute window between the release commit being created and this push.
// Observed on 1.1.17: #3125 was merged while #3053's publish was building, the
// plain `git push origin HEAD:main` was rejected as non-fast-forward, and the
// release ended up on npm with no version bump commit, no tag and no GitHub
// Release on `main`.
//
// Usage: node .github/scripts/push-release.mjs <branch> <tag>

import { spawnSync } from "node:child_process";

// Enough to outlast a burst of merges; one rebase attempt costs about a second.
// Bounded so a pathological loop fails the job instead of running to the step
// timeout.
const MAX_ATTEMPTS = 5;

const [branch, tag] = process.argv.slice(2);

if (!branch || !tag) {
  console.error("Usage: push-release.mjs <branch> <tag>");
  process.exit(1);
}

const tryGit = (...args) => spawnSync("git", args, { stdio: "inherit" }).status;

const git = (...args) => {
  const status = tryGit(...args);
  if (status !== 0) {
    fail(`git ${args.join(" ")} exited with ${status}.`);
  }
};

function fail(message) {
  console.error(
    `::error::${message} The packages are already on npm — advance ` +
      `'${branch}' and push tag '${tag}' by hand.`,
  );
  process.exit(1);
}

// `--no-verify` at every push even though the workflow sets
// SKIP_INSTALL_SIMPLE_GIT_HOOKS: this is the one place where a `pre-push` hook
// aborting strands a release npm has already accepted (#2932), so the guard
// does not depend on a workflow-level env var staying put.
const push = () => tryGit("push", "--no-verify", "origin", `HEAD:${branch}`);

for (let attempt = 1; push() !== 0; attempt++) {
  if (attempt >= MAX_ATTEMPTS) {
    fail(
      `Could not push the release commit to '${branch}' after ${MAX_ATTEMPTS} attempts.`,
    );
  }

  console.log(
    `::warning::'${branch}' advanced while this release was building — ` +
      `rebasing the release commit onto the new tip (attempt ${attempt}).`,
  );

  git("fetch", "origin", branch);

  // Rebase onto FETCH_HEAD, not `origin/<branch>`: actions/checkout configures
  // a single-branch refspec, so whether the remote-tracking ref follows this
  // fetch depends on which line the run is on. FETCH_HEAD is what we just
  // fetched, always.
  //
  // The only commit replayed is the `chore(release):` bump — or nothing at all,
  // for a pre-graduated promotion whose version commit arrived with the merge,
  // where the rebase degenerates into the fast-forward that push needed. It
  // touches package manifests and changelogs, which no concurrent merge writes:
  // every other writer of those files serializes on the same concurrency group.
  // A conflict therefore means something unmodelled happened. Stop with the
  // working tree clean rather than resolve it blind.
  //
  // `--autostash` because `pnpm build` ran between the release commit and here:
  // a stray regenerated file would otherwise make rebase refuse outright, and
  // the tree's contents no longer matter — everything is published.
  if (tryGit("rebase", "--autostash", "FETCH_HEAD") !== 0) {
    tryGit("rebase", "--abort");
    fail(`Rebasing the release commit onto 'origin/${branch}' hit a conflict.`);
  }
}

// Re-point rather than create-if-missing. A rebase leaves lerna's tag on the
// pre-rebase commit, which is now unreachable — without `-f` the tag would mark
// a commit that is on no branch. In the happy path HEAD is already what lerna
// tagged, so this rewrites the tag onto the same commit: a no-op. The
// pre-graduated promotion path (RFC #2711) has no tag yet and gets one here,
// exactly as before.
git("tag", "-f", "-m", tag, tag, "HEAD");
git("push", "--no-verify", "origin", `refs/tags/${tag}`);
