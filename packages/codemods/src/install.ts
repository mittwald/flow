import { execFileSync } from "node:child_process";
import { satisfies, validRange } from "semver";
import { resolveCommand } from "package-manager-detector/commands";
import { INSTALL_PAGE } from "package-manager-detector/constants";
import { detect } from "package-manager-detector/detect";
import type { Agent, DetectResult } from "package-manager-detector";

/**
 * The project's package manager, as `upgrade` needs to know it.
 *
 * `agent` is what resolves a command (`yarn` and `yarn@berry` want different
 * ones); `version` is the pin from `packageManager`, when there is one, and is
 * the string `"berry"` rather than a number for Yarn 2+ — see `pinnedRange`.
 */
export type PackageManager = Pick<DetectResult, "name" | "agent" | "version">;

/** Every strategy the library offers, in the order it applies them. */
const strategies = [
  "lockfile",
  "packageManager-field",
  "devEngines-field",
  // Not in the library's default set. `upgrade` always runs on an installed
  // project — it reads `node_modules` to learn the current Flow version — so the
  // marker a manager leaves in there is a real signal, and the last one before
  // the npm fallback.
  "install-metadata",
] as const;

/** What a project with no signal at all gets. */
const fallback: PackageManager = { name: "npm", agent: "npm" };

/**
 * The package manager for the project at `cwd`.
 *
 * Detection walks **up** from `cwd`, which is the whole point: the previous
 * implementation looked for lockfiles in `cwd` only, and a workspace package
 * has none of its own. In a Yarn or pnpm monorepo it therefore fell through to
 * the npm default and ran `npm install`, which on a workspace manifest dies
 * with `EUNSUPPORTEDPROTOCOL Unsupported URL Type "workspace:"` — after
 * `upgrade` had already rewritten `package.json`. It also ignored
 * `packageManager` entirely.
 *
 * Per directory the strategies are applied in order, so a lockfile in `cwd`
 * still beats a `packageManager` pin in a parent — and when the lockfile
 * strategy hits, the library reads that same directory's `package.json` and
 * lets its pin win. That is the precedence we want, and it is the library's,
 * not ours.
 *
 * Npm on `null`, preserving the old fallback: it is the one manager always
 * present next to Node, so a project with no signal gets an install rather than
 * an error.
 */
export const detectPackageManagerIn = async (
  cwd: string,
): Promise<PackageManager> =>
  (await detect({ cwd, strategies: [...strategies] })) ?? fallback;

export interface InstallCommand {
  command: string;
  args: string[];
  /** Extra environment for the install. Empty when none is needed. */
  env: Record<string, string>;
}

/**
 * How to install with `agent`, so that the install actually updates the
 * lockfile.
 *
 * `upgrade` has just rewritten `package.json`, so the lockfile is deliberately
 * stale. pnpm and Yarn Berry both switch on frozen/immutable installs by
 * themselves when they detect CI, where an install then _fails_ instead of
 * updating — and CI is exactly where this runs unattended. pnpm takes a flag;
 * Yarn's flag differs between Classic and Berry, so it gets the environment
 * variable instead, which Classic ignores harmlessly. Keeping the env var also
 * keeps this one code path rather than branching on a Berry detection being
 * right.
 *
 * The command itself comes from the library. Its `"install"` is the plain
 * install for every agent — the frozen variants are a separate command there —
 * so these quirks stay ours.
 */
export const installCommand = (agent: Agent): InstallCommand => {
  const frozenOptOut = agent.startsWith("pnpm") ? ["--no-frozen-lockfile"] : [];
  const resolved = resolveCommand(agent, "install", frozenOptOut);

  if (resolved === null) {
    throw new Error(
      `${agent} has no install command. Install the dependencies yourself, then re-run this command.`,
    );
  }

  return {
    command: resolved.command,
    args: resolved.args,
    env: agent.startsWith("yarn")
      ? { YARN_ENABLE_IMMUTABLE_INSTALLS: "false" }
      : {},
  };
};

/**
 * The pin as a semver range, or `undefined` when there is nothing to check.
 *
 * Two values have to be filtered out. `"berry"` is what the library reports for
 * Yarn 2+ — a specifier, not a version — and for an unparseable
 * `packageManager` it hands back the raw string. Neither is a range, and
 * `satisfies` would throw on both.
 *
 * A full pin like `8.15.0` is a valid range meaning exactly that version, so
 * one comparison covers both `pnpm@8` and `pnpm@8.15.0`. That is also why this
 * is `satisfies` and not a string compare: the library reports the
 * `\d+(\.\d+){0,2}` match out of the field, so `packageManager: "pnpm@8"`
 * yields the pin `"8"` while the binary reports `8.15.0` — a string compare
 * would send a perfectly fine setup through corepack.
 */
export const pinnedRange = (version: string | undefined): string | undefined =>
  version !== undefined && version !== "berry" && validRange(version) !== null
    ? version
    : undefined;

/**
 * Runs a command and returns its trimmed stdout, or `undefined` if it fails.
 *
 * Injected so the pin logic is testable without shelling out — the same reason
 * `InstallRunner` exists. It is not a CLI flag: the seam belongs in the code.
 */
export type Probe = (command: string, args: string[]) => string | undefined;

export const runProbe: Probe = (command, args) => {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      shell: process.platform === "win32",
    }).trim();
  } catch {
    return undefined;
  }
};

export interface InstallPlan {
  command: string;
  args: string[];
  env: Record<string, string>;
  /** How this reads in the log — agent, pin, and the command actually run. */
  description: string;
}

/**
 * What to run for `manager`, honouring a `packageManager` pin.
 *
 * The decision tree, and why it checks before reaching for corepack:
 *
 * | Situation                                         | Behaviour                 |
 * | ------------------------------------------------- | ------------------------- |
 * | No pin, or the `"berry"` specifier                | run directly              |
 * | Pin, binary present, version satisfies it         | run directly              |
 * | Pin, mismatch or binary missing, corepack present | run under corepack        |
 * | Pin, mismatch or missing, no corepack             | throw, before any install |
 *
 * Corepack ignores `PATH` and downloads into its own cache, so "always
 * corepack" would send every project that has a `packageManager` field — most
 * of them — through a download, offline CI included. pnpm 9.7+ additionally
 * installs its own pinned version, so for pnpm the direct path is usually
 * already right.
 *
 * `COREPACK_ENABLE_DOWNLOAD_PROMPT=0` is required rather than tidy: corepack
 * prompts interactively before a first download, and `upgrade` runs unattended
 * (`-y` is implied with no TTY). Only one `install` is spawned under corepack —
 * no nested per-task spawns — so the corepack footgun in the repo's root
 * `AGENTS.md` does not apply.
 */
export const planInstall = (
  manager: PackageManager,
  probe: Probe = runProbe,
): InstallPlan => {
  const { command, args, env } = installCommand(manager.agent);
  const line = [command, ...args].join(" ");
  const pin = pinnedRange(manager.version);

  if (pin === undefined) {
    return { command, args, env, description: `${manager.agent} — ${line}` };
  }

  const found = probe(command, ["--version"]);
  if (found !== undefined && satisfies(found, pin)) {
    return {
      command,
      args,
      env,
      description: `${manager.agent} ${found} — ${line}`,
    };
  }

  if (probe("corepack", ["--version"]) === undefined) {
    throw new Error(
      `This project pins ${manager.name}@${pin} in "packageManager", but ${
        found === undefined
          ? `${command} is not on PATH`
          : `the ${command} on PATH is ${found}`
      }, and corepack is not available to bridge the gap.\n\nInstall ${
        manager.name
      }@${pin} (${
        INSTALL_PAGE[manager.agent]
      }) or enable corepack, then re-run this command. Nothing has been installed.`,
    );
  }

  return {
    command: "corepack",
    args: [command, ...args],
    env: { ...env, COREPACK_ENABLE_DOWNLOAD_PROMPT: "0" },
    description: `${manager.agent} ${pin} via corepack — corepack ${line}`,
  };
};

/**
 * Runs the install.
 *
 * A named type rather than a bare call so tests can substitute it. There is no
 * `--no-install` flag: the seam belongs in the code, not in the CLI surface.
 *
 * Returns the plan's description so the caller can log what actually ran — a
 * wrong detection then shows up in the output instead of silently installing
 * with the wrong manager.
 */
export type InstallRunner = (manager: PackageManager, cwd: string) => string;

export const runInstall: InstallRunner = (manager, cwd) => {
  const plan = planInstall(manager);
  execFileSync(plan.command, plan.args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...plan.env },
    // Node has refused to spawn `.cmd`/`.bat` without a shell since 2024, which
    // is why every non-npm manager died with ENOENT on Windows. Every argument
    // here is our own literal or the library's, so there is no quoting hazard.
    shell: process.platform === "win32",
  });
  return plan.description;
};

/**
 * How to tell a reader to invoke this package, for the manager they use.
 *
 * `npx …` for npm and Yarn Classic (which has no `dlx`), `pnpm dlx …`, `yarn
 * dlx …`, `bun x …`. The package name is passed as an argument rather than
 * baked in, so the library decides the whole prefix.
 *
 * Falls back to the `npx` form when the agent has no `execute` command: a
 * printed hint is worth more than a gap, and npx is the one form every reader
 * can run.
 */
export const resolveInvoke = async (
  cwd: string,
  pkg = "@mittwald/flow-codemods@latest",
): Promise<string> => {
  const { agent } = await detectPackageManagerIn(cwd);
  const resolved = resolveCommand(agent, "execute", [pkg]);
  return resolved === null
    ? `npx ${pkg}`
    : [resolved.command, ...resolved.args].join(" ");
};
