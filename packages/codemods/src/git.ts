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
export const hasUncommittedChanges = (cwd: string): boolean => {
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
    return status.trim() !== "";
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
      return false;
    }
    throw new Error(
      `Could not check the working tree with git: ${
        error instanceof Error ? error.message : error
      }`,
      { cause: error },
    );
  }
};
