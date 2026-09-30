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
// WHY A MERGE, NOT A REBASE (#3351)
// The tag has to stay on the commit that was built. Rebasing the release commit
// onto the concurrent merge put that merge UNDER the tag although the published
// packages did not contain it: the next release started its changelog at the
// tag, so the change was in no changelog, and its own publish run had been
// cancelled by the release push, so it got no release either (#3289 in 1.3.0).
// Instead the line gets a merge commit whose FIRST parent is the release commit
// and whose second parent is the new tip. The push stays a fast-forward,
// lerna-lite's `git describe --first-parent` still finds the tag, and the next
// range `tag..HEAD` holds the concurrent change. The merge commit is not a
// `chore(release):` commit, so its push starts a regular publish run that
// releases the change; `publish.yml` classifies that run's relevance from the
// first parent, not from the push range, which is only version churn.
//
// Usage: node .github/scripts/push-release.mjs <branch> <tag>

import { spawnSync } from "node:child_process";

// Enough to outlast a burst of merges; one merge attempt costs about a second.
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

// What was built and published: lerna's release commit, or — for a
// pre-graduated promotion (RFC #2711), whose version commit arrived with the
// merge — the promotion merge itself. The tag goes here, whatever the line does.
const released = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).stdout.trim();

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

  // FETCH_HEAD, not `origin/<branch>`: actions/checkout configures a
  // single-branch refspec, so whether the remote-tracking ref follows this
  // fetch depends on which line the run is on. FETCH_HEAD is what we just
  // fetched, always.
  git("fetch", "origin", branch);

  // A pre-graduated promotion is already on the line; only the concurrent merge
  // is newer. Nothing to push — tag the promotion where it is.
  if (tryGit("merge-base", "--is-ancestor", released, "FETCH_HEAD") === 0) {
    console.log(
      `::notice::'${branch}' already contains ${released.slice(0, 9)} — tagging it in place.`,
    );
    break;
  }

  console.log(
    `::warning::'${branch}' advanced while this release was building — ` +
      `merging it into the release commit (attempt ${attempt}).`,
  );

  // Back to the release commit on every attempt, so the merge always has it as
  // first parent and the latest tip as second. `--hard` also drops what
  // `pnpm build` regenerated since the release commit: the tree's contents no
  // longer matter, everything is published.
  git("reset", "--quiet", "--hard", released);

  // The release commit touches package manifests and changelogs, which no
  // concurrent merge writes: every other writer of those files serializes on
  // the same concurrency group. A conflict therefore means something unmodelled
  // happened. Stop with the working tree clean rather than resolve it blind.
  if (
    tryGit(
      "merge",
      "--no-ff",
      "-m",
      `Merge ${branch} into release ${tag}`,
      "-m",
      `'${branch}' advanced while ${tag} was building. The first parent is the\n` +
        `release commit that was built and tagged, the second brings what\n` +
        `merged meanwhile; this commit's own publish run releases it (#3351).`,
      "FETCH_HEAD",
    ) !== 0
  ) {
    tryGit("merge", "--abort");
    fail(`Merging 'origin/${branch}' into the release commit hit a conflict.`);
  }
}

// Re-point rather than create-if-missing. In the happy path lerna's tag already
// marks `released`, so this is a no-op; the pre-graduated promotion path has no
// tag yet and gets one here.
git("tag", "-f", "-m", tag, tag, released);
git("push", "--no-verify", "origin", `refs/tags/${tag}`);
