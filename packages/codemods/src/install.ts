import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

/** Lockfile to manager, in precedence order. */
const lockfiles: [string, PackageManager][] = [
  ["pnpm-lock.yaml", "pnpm"],
  ["bun.lock", "bun"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
];

/**
 * The package manager a project uses, from the lockfiles present.
 *
 * Npm is the fallback: it is the one manager that is always available next to
 * Node, so a project with no lockfile still gets an install rather than an
 * error.
 */
export const detectPackageManager = (present: string[]): PackageManager => {
  for (const [lockfile, manager] of lockfiles) {
    if (present.includes(lockfile)) {
      return manager;
    }
  }
  return "npm";
};

export const detectPackageManagerIn = (cwd: string): PackageManager =>
  detectPackageManager(
    lockfiles
      .map(([lockfile]) => lockfile)
      .filter((lockfile) => existsSync(join(cwd, lockfile))),
  );

export const installCommand = (manager: PackageManager): [string, string[]] => [
  manager,
  ["install"],
];

/**
 * Runs the install.
 *
 * A named type rather than a bare call so tests can substitute it. There is no
 * `--no-install` flag: the seam belongs in the code, not in the CLI surface.
 */
export type InstallRunner = (manager: PackageManager, cwd: string) => void;

export const runInstall: InstallRunner = (manager, cwd) => {
  const [command, args] = installCommand(manager);
  execFileSync(command, args, { cwd, stdio: "inherit" });
};
