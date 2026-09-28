// Points git at the repo's own hooks: `core.hooksPath` = `.githooks`, whose
// scripts are committed and reviewable like any other file.
//
// Run via `pnpm dev:init-githooks`; `prepare` also runs it after every install,
// so a normal checkout has the hooks without thinking about it.
//
// Why a config switch and not an installer: an installer writes the hooks into
// `.git/hooks` wherever `pnpm install` runs, RUNNERS INCLUDED. A workflow that
// installs and then pushes, merges or checks out inherits hooks it never asked
// for — `pre-push` turns a one-line screenshot commit into a full repo lint,
// and a lint failure there aborts a push AFTER `npm publish` already succeeded,
// stranding a release with no commit, no tag and no GitHub Release (#2932).
// Opting out per workflow was discipline: every new workflow had to remember
// it, and forgetting is silent. The CI check lives here instead, in one place.
//
// `core.hooksPath` is repository config, so setting it once covers every
// worktree — and a RELATIVE path resolves against each worktree's own working
// tree, so the hooks version with the branch instead of being one generated
// copy shared by all of them. A branch without `.githooks` simply has no hooks.

const { spawnSync } = require("node:child_process");

// GitHub Actions sets CI on every runner. Nothing here should ever configure a
// runner to run our hooks.
if (process.env.CI) {
  process.exit(0);
}

if (["1", "true"].includes(process.env.SKIP_GIT_HOOKS)) {
  process.exit(0);
}

// `prepare` runs on every install, including places where there is no git
// repository (tarball installs, containers). Nothing to configure there.
if (
  spawnSync("git", ["rev-parse", "--git-dir"], { stdio: "ignore" }).status !== 0
) {
  process.exit(0);
}

const result = spawnSync("git", ["config", "core.hooksPath", ".githooks"], {
  stdio: "inherit",
});

// Not fatal: a checkout without hooks is inconvenient, a failed `pnpm install`
// is not. The hooks are a convenience, and CI enforces what they check anyway.
if (result.status !== 0) {
  console.error(
    "init-git-hooks: could not set core.hooksPath. Run `pnpm dev:init-githooks` to retry.",
  );
}
