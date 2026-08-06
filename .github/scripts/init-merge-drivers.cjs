// Registers the forward-merge merge drivers in the LOCAL git config (ADR 0004
// §3). A `merge=<driver>` attribute in `.gitattributes` is inert on its own —
// git only runs a driver that is also configured in the repository's git config,
// and git config is deliberately not versioned.
//
// `.github/workflows/forward-merge.yml` does this for the runner. This script
// does it for a developer checkout, which matters when a forward-merge conflict
// escalates to a `sync/main-to-next` PR: GitHub does NOT run merge drivers, so
// the version/changelog churn the drivers absorb reappears as conflicts. Only a
// LOCAL resolution with the drivers registered keeps that noise away from the
// genuine conflict.
//
// Run via `pnpm dev:init-merge-drivers`; `prepare` also runs it after every
// install, so a normal checkout has the drivers without thinking about it.

const { spawnSync } = require("node:child_process");

// `prepare` runs on every install, including places where there is no git
// repository (tarball installs, containers). Nothing to register there.
if (
  spawnSync("git", ["rev-parse", "--git-dir"], { stdio: "ignore" }).status !== 0
) {
  process.exit(0);
}

const drivers = {
  // `merge=ours` keeps the higher line's file wholesale — `true` is a no-op
  // command, which leaves "our" version in place and exits successfully.
  "merge.ours.driver": "true",
  "merge.package-json.driver":
    "node .github/scripts/merge-package-json.cjs %O %A %B %L %P",
};

for (const [key, value] of Object.entries(drivers)) {
  const result = spawnSync("git", ["config", key, value], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`init-merge-drivers: failed to set ${key}`);
    process.exit(1);
  }
}

console.log("Forward-merge merge drivers registered (ours, package-json).");
