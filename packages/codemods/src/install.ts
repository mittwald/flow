import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

/** Lockfile to manager, in precedence order. */
const lockfiles: [string, PackageManager][] = [
  ["pnpm-lock.yaml", "pnpm"],
  // Both Bun lockfile names: `bun.lock` (text) is the default only from Bun
  // 1.2; before that Bun writes the binary `bun.lockb`, which plenty of
  // projects still have. Missing it would fall through to the npm default and
  // run `npm install` on a Bun project, leaving a stray package-lock.json.
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
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

export interface InstallCommand {
  command: string;
  args: string[];
  /** Extra environment for the install. Empty when none is needed. */
  env: Record<string, string>;
}

/**
 * How to install with a given manager, so that the install actually updates the
 * lockfile.
 *
 * `upgrade` has just rewritten `package.json`, so the lockfile is deliberately
 * stale. pnpm and Yarn Berry both switch on frozen/immutable installs by
 * themselves when they detect CI, where an install then _fails_ instead of
 * updating — and CI is exactly where this runs unattended. pnpm takes a flag;
 * Yarn's flag differs between Classic and Berry, so it gets the environment
 * variable instead, which Classic ignores harmlessly.
 */
export const installCommand = (manager: PackageManager): InstallCommand => {
  switch (manager) {
    case "pnpm":
      return {
        command: "pnpm",
        args: ["install", "--no-frozen-lockfile"],
        env: {},
      };
    case "yarn":
      return {
        command: "yarn",
        args: ["install"],
        env: { YARN_ENABLE_IMMUTABLE_INSTALLS: "false" },
      };
    case "npm":
    case "bun":
      return { command: manager, args: ["install"], env: {} };
  }
};

/**
 * Runs the install.
 *
 * A named type rather than a bare call so tests can substitute it. There is no
 * `--no-install` flag: the seam belongs in the code, not in the CLI surface.
 */
export type InstallRunner = (manager: PackageManager, cwd: string) => void;

export const runInstall: InstallRunner = (manager, cwd) => {
  const { command, args, env } = installCommand(manager);
  execFileSync(command, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
};
