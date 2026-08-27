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
      stdio: ["ignore", "pipe", "ignore"],
    });
    return status.trim() !== "";
  } catch (error) {
    // Only "not a git repository" counts as clean. git answers that with exit
    // 128; a missing binary throws `ENOENT` with no exit status at all. Treating
    // the two alike would make the guard fail *open* — it would report a clean
    // tree on a machine without git, which is exactly the minimal CI container
    // where nobody is watching the run.
    if ((error as { status?: number }).status === 128) {
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
