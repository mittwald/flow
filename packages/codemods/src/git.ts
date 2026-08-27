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
  } catch {
    return false;
  }
};
