// `pnpm sync:resolve` — resolve a blocked forward-merge (ADR 0004 §4).
//
// When the cascade hits a genuine conflict it cannot resolve, it opens an issue
// and stops. This script is the whole path back: it reproduces the exact merge
// the runner attempted, in your own checkout, so the conflict arrives in your
// editor and your merge tool like any other conflict.
//
//   pnpm sync:resolve             # merge main into next locally
//   …resolve the conflicts…
//   pnpm sync:resolve --continue  # commit, push, open the PR
//
// Why locally and not on the PR: GitHub does not run the merge drivers from
// `.gitattributes` — a driver only exists in local git config — so a PR-side
// merge shows every `version` and `CHANGELOG.md` divergence between the two
// lines as a conflict. Here the drivers run, and only genuine conflicts are
// left.

const { spawnSync } = require("node:child_process");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

const BRANCH = "sync/main-to-next";
const CONTINUE = process.argv.includes("--continue");

// Built rather than written out, so this file does not trip its own scan.
const OPEN_MARKER = "<".repeat(7);
const CLOSE_MARKER = ">".repeat(7);

function git(args, { capture = true } = {}) {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    stdio: capture ? "pipe" : "inherit",
  });
  return {
    status: result.status,
    out: (result.stdout ?? "").trim(),
    err: (result.stderr ?? "").trim(),
  };
}

function fail(message, hint) {
  console.error(`\n✖ ${message}`);
  if (hint) {
    console.error(`  ${hint}`);
  }
  process.exit(1);
}

function gitDir() {
  const { status, out } = git(["rev-parse", "--git-dir"]);
  if (status !== 0) {
    fail("Not a git repository.");
  }
  return out;
}

function conflictedFiles() {
  const { out } = git(["diff", "--name-only", "--diff-filter=U"]);
  return out ? out.split("\n") : [];
}

function filesWithMarkers(files) {
  return files.filter((file) => {
    if (!existsSync(file)) {
      return false;
    }
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      return false;
    }
    return content
      .split("\n")
      .some(
        (line) => line.startsWith(OPEN_MARKER) || line.startsWith(CLOSE_MARKER),
      );
  });
}

function start() {
  const { out: dirty } = git(["status", "--porcelain"]);
  if (dirty) {
    fail(
      "Your working tree is not clean.",
      "Commit or stash your changes first — this script performs a merge.",
    );
  }

  console.log("Fetching origin…");
  if (git(["fetch", "--no-tags", "origin", "main", "next"]).status !== 0) {
    fail("Could not fetch `main` and `next` from origin.");
  }

  if (
    git(["merge-base", "--is-ancestor", "origin/main", "origin/next"])
      .status === 0
  ) {
    console.log(
      "\n✔ `next` already contains `main` — nothing to resolve.\n" +
        "  Someone may have resolved this already; check whether the sync issue can be closed.",
    );
    return;
  }

  // The drivers are what keep version/CHANGELOG churn out of the conflict.
  // `prepare` registers them on install, but never assume.
  spawnSync("node", [join(".github", "scripts", "init-merge-drivers.cjs")], {
    stdio: "inherit",
  });

  console.log(`Creating \`${BRANCH}\` from origin/next…`);
  if (
    git(["checkout", "-B", BRANCH, "origin/next"], { capture: false })
      .status !== 0
  ) {
    fail(`Could not create \`${BRANCH}\`.`);
  }

  const short = git(["rev-parse", "--short", "origin/main"]).out;
  const message = `chore(sync): forward-merge main into next (${short})`;
  const merge = git(["merge", "--no-ff", "-m", message, "origin/main"], {
    capture: false,
  });

  if (merge.status === 0) {
    console.log(
      "\n✔ The merge resolved cleanly — the drivers absorbed everything.\n" +
        "  Run `pnpm sync:resolve --continue` to push it and open the PR.",
    );
    return;
  }

  const conflicts = conflictedFiles();
  if (conflicts.length === 0) {
    fail(
      "The merge failed without leaving a conflict.",
      "Run `git merge --abort` and check the output above.",
    );
  }

  console.log(
    `\n${conflicts.length} file(s) need you — everything else merged automatically:\n`,
  );
  for (const file of conflicts) {
    console.log(`  ${file}`);
  }
  console.log(
    "\nResolve them in your editor (or `git mergetool`), then run:\n" +
      "\n  pnpm sync:resolve --continue\n",
  );
}

function proceed() {
  const inMerge = existsSync(join(gitDir(), "MERGE_HEAD"));
  const { out: branch } = git(["rev-parse", "--abbrev-ref", "HEAD"]);

  if (branch !== BRANCH) {
    fail(
      `You are on \`${branch}\`, not \`${BRANCH}\`.`,
      "Run `pnpm sync:resolve` first.",
    );
  }

  if (inMerge) {
    const unresolved = conflictedFiles();
    const changed = git(["diff", "--name-only", "origin/next...HEAD"]).out;
    const candidates = unresolved.length
      ? unresolved
      : changed
        ? changed.split("\n")
        : [];
    const leftovers = filesWithMarkers(candidates);

    if (leftovers.length > 0) {
      fail(
        `Conflict markers are still present in: ${leftovers.join(", ")}`,
        "Resolve them, then run this again.",
      );
    }

    git(["add", "-A"], { capture: false });
    if (git(["commit", "--no-edit"], { capture: false }).status !== 0) {
      fail("Could not commit the merge.");
    }
    console.log("Merge committed.");
  } else {
    console.log("No merge in progress — assuming it is already committed.");
  }

  console.log(`Pushing \`${BRANCH}\`…`);
  if (
    git(["push", "--force-with-lease", "origin", `HEAD:refs/heads/${BRANCH}`], {
      capture: false,
    }).status !== 0
  ) {
    fail(`Could not push \`${BRANCH}\`.`);
  }

  openPullRequest();
}

function openPullRequest() {
  const gh = (args) =>
    spawnSync("gh", args, { encoding: "utf8", stdio: "pipe" });

  const existing = gh([
    "pr",
    "list",
    "--head",
    BRANCH,
    "--base",
    "next",
    "--state",
    "open",
    "--json",
    "url",
    "--jq",
    ".[].url",
  ]);

  if (existing.status !== 0) {
    console.log(
      "\n✔ Pushed. Could not reach the GitHub CLI, so open the PR yourself:\n" +
        `\n  ${BRANCH} → next, merged as a TRUE MERGE COMMIT (never squash/rebase).\n`,
    );
    return;
  }

  const url = (existing.stdout ?? "").trim();
  if (url) {
    console.log(`\n✔ Pushed to the existing PR: ${url}\n`);
    return;
  }

  // Reference the escalation issue. Note that `Closes #n` would NOT work here:
  // GitHub only auto-closes a linked issue when the PR merges into the DEFAULT
  // branch, and this one targets `next`. The cascade closes it instead, as soon
  // as it observes that `next` contains `main` again.
  const issue = gh([
    "issue",
    "list",
    "--state",
    "open",
    "--label",
    "sync",
    "--search",
    'in:title "Forward-merge blocked"',
    "--json",
    "number",
    "--jq",
    ".[0].number // empty",
  ]);
  const issueNumber = issue.status === 0 ? (issue.stdout ?? "").trim() : "";

  const body = [
    "Resolves the forward-merge conflict between `main` and `next` (ADR 0004 §4), resolved locally with the merge drivers active via `pnpm sync:resolve`.",
    "",
    "Merge this **as a true merge commit** — a squash or rebase merge would break the superset invariant (ADR 0004 §1) and is blocked by branch protection on `next`.",
    ...(issueNumber
      ? [
          "",
          `Escalation: #${issueNumber} — closed automatically once \`next\` contains \`main\` again.`,
        ]
      : []),
  ].join("\n");

  const created = gh([
    "pr",
    "create",
    "--base",
    "next",
    "--head",
    BRANCH,
    "--title",
    "chore(sync): resolve forward-merge conflict (main into next)",
    "--label",
    "sync",
    "--label",
    "automated",
    "--body",
    body,
  ]);

  if (created.status === 0) {
    console.log(`\n✔ Done: ${(created.stdout ?? "").trim()}\n`);
  } else {
    console.log(
      `\n✔ Pushed, but the PR could not be created automatically:\n  ${(created.stderr ?? "").trim()}\n`,
    );
  }
}

gitDir();
if (CONTINUE) {
  proceed();
} else {
  start();
}
