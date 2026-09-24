import { execFileSync } from "node:child_process";

/**
 * Whether the working tree has changes that a codemod run would mix into.
 *
 * `upgrade` refuses on a dirty tree unless `--allow-dirty`. This matters most
 * where nobody is watching: `-y` is implied when stdin is not a TTY, so an
 * agent or CI run would otherwise blend its own unfinished work into the
 * codemod diff with no way to separate them afterwards.
 *
 * A directory that is not a git repository counts as clean — refusing there
 * would block a legitimate run for a reason the consumer cannot fix.
 */
export const hasUncommittedChanges = (cwd: string): boolean =>
  changedPaths(cwd).length > 0;

/**
 * Every path `git status --porcelain` reports for `cwd`, repository-relative.
 *
 * `upgrade` takes this before it writes the manifest and again after the
 * install, and names whatever is new. The install is not confined to
 * `package.json` and the lockfile: pnpm 11 rewrites `pnpm-workspace.yaml` on an
 * explicit bump, adding a `minimumReleaseAgeExclude` entry for the
 * just-published version — and on pnpm 11.5 it appends a second entry for a
 * package that already has one, which its own `verifyDepsBeforeRun` then
 * resolves to the first match, so every script in that package fails before it
 * runs. Nothing in the tool's report said the file had been touched, leaving
 * `git status` as the only trace (#3117).
 *
 * Empty for a directory that is not a git repository — the same "cannot tell,
 * so do not block" stance `hasUncommittedChanges` takes.
 */
export const changedPaths = (cwd: string): string[] => {
  try {
    const status = execFileSync("git", ["status", "--porcelain"], {
      cwd,
      encoding: "utf8",
      // stderr captured, not ignored: exit 128 alone cannot tell "not a
      // repository" from the other fatals, and the difference decides whether
      // the guard may report a clean tree. `LC_ALL=C` pins the message this
      // reads to English — git localises its fatals.
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, LC_ALL: "C" },
    });
    return (
      status
        .split("\n")
        .filter((line) => line.trim() !== "")
        // Porcelain v1: two status characters, a space, then the path. A rename
        // reads `R  old -> new`; the new path is the one that exists now.
        .map((line) => line.slice(3).split(" -> ").at(-1) ?? "")
        .filter((path) => path !== "")
        // A path with a space, a quote or a non-ASCII byte comes back C-quoted.
        // Only the surrounding quotes matter here — this is a name to print and
        // to compare against the same reader's earlier output, not one to open.
        .map((path) => path.replace(/^"(.*)"$/, "$1"))
    );
  } catch (error) {
    // Exit 128 is *not* only "not a git repository". `detected dubious
    // ownership` is 128 too, and that is the minimal CI container this guard
    // exists for — treating every 128 as clean made it fail open in exactly
    // the case nobody is watching. So match the message, not the code, and let
    // every other failure throw. A missing binary throws `ENOENT` with no exit
    // status and no stderr, and lands in the throw below.
    const stderr = String((error as { stderr?: unknown }).stderr ?? "");
    if (
      (error as { status?: number }).status === 128 &&
      /not a git repository/i.test(stderr)
    ) {
      return [];
    }
    throw new Error(
      `Could not check the working tree with git: ${
        error instanceof Error ? error.message : error
      }`,
      { cause: error },
    );
  }
};
