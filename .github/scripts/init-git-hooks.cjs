// Installs the git hooks declared under `simple-git-hooks` in package.json —
// `pre-push` = `pnpm lint`, `post-checkout`/`post-merge` = `pnpm install`.
//
// Run via `pnpm dev:init-githooks`; `prepare` also runs it after every install,
// so a normal checkout has the hooks without thinking about it.
//
// Why this and not the package's own postinstall: that one runs wherever
// `pnpm install` runs, RUNNERS INCLUDED. A workflow that installs and then
// pushes, merges or checks out inherits hooks it never asked for — `pre-push`
// turns a one-line screenshot commit into a full repo lint, and a lint failure
// there aborts a push AFTER `npm publish` already succeeded, stranding a
// release with no commit, no tag and no GitHub Release (#2932). Opting out per
// workflow (`SKIP_INSTALL_SIMPLE_GIT_HOOKS: "1"`) worked but was discipline:
// every new workflow had to remember it, and forgetting is silent. So
// simple-git-hooks is NOT in pnpm-workspace.yaml's `allowBuilds` — its
// postinstall never runs — and hook installation happens here, where the CI
// check lives in one place.

const { spawnSync } = require("node:child_process");

// GitHub Actions sets CI on every runner. Nothing here should ever write a
// runner's .git/hooks.
if (process.env.CI) {
  process.exit(0);
}

// Honours the env var the package's own postinstall read, so an existing opt-out
// keeps working.
if (["1", "true"].includes(process.env.SKIP_INSTALL_SIMPLE_GIT_HOOKS)) {
  process.exit(0);
}

// `prepare` runs on every install, including places where there is no git
// repository (tarball installs, containers). Nothing to install there.
if (
  spawnSync("git", ["rev-parse", "--git-dir"], { stdio: "ignore" }).status !== 0
) {
  process.exit(0);
}

// Resolved, not looked up on PATH: `prepare` is also invoked directly
// (`pnpm dev:init-githooks`, a bare `node`), where node_modules/.bin is not on it.
const result = spawnSync(
  process.execPath,
  [require.resolve("simple-git-hooks/cli.js")],
  { stdio: "inherit" },
);

// Not fatal: a checkout without hooks is inconvenient, a failed `pnpm install`
// is not. The hooks are a convenience, and CI enforces what they check anyway.
if (result.status !== 0) {
  console.error(
    "init-git-hooks: could not install the git hooks. Run `pnpm dev:init-githooks` to retry.",
  );
}
