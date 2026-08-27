#!/usr/bin/env node
import { checkbox } from "@inquirer/prompts";
import { allEntries } from "./catalog/entries.js";
import { parseArguments } from "./cli/args.js";
import { createChoose } from "./cli/choose.js";
import { resolveSourcePath, runSingleCodemod } from "./cli/codemod.js";
import { renderDetect, runDetect } from "./cli/detect.js";
import { renderList, validateListBounds } from "./cli/list.js";
import { defaultUpgradeDeps, runUpgrade } from "./cli/upgrade.js";
import { renderVerify, runVerify } from "./cli/verify.js";

const usage = `flow-codemods — migrate a codebase across Flow versions

Usage:
  flow-codemods upgrade [revision]   Bump every Flow dependency, install, run codemods
  flow-codemods <id> [path]          Run a single codemod
  flow-codemods list                 Show the migrations for a version range
  flow-codemods detect [path]        List which migrations touch this codebase
  flow-codemods verify [path]        Check whether each migration is applied

Revision: patch | minor | major | a dist-tag (latest, next) | an exact version.
Default is minor, which stays inside the current major.

Options:
  -y, --yes          Accept every default. Implied when stdin is not a TTY.
      --allow-dirty  Run even though the working tree has uncommitted changes
      --dry          Do not write files
      --print        Print the transformed output
      --path         Sources to transform
      --from, --to   Bound the range for "list"
      --json         Machine-readable output for "list"
  -h, --help         Show this text
  -V, --version      Show the version
`;

const main = async (): Promise<number> => {
  const parsed = parseArguments(process.argv.slice(2));

  // Deliberate single ordered report stream: every command-level failure below
  // that a real invocation can hit — `list`'s bound check, `codemod`'s and
  // `upgrade`'s injected `log` — writes to stdout, interleaved with the rest of
  // that command's normal output, in the order it happened. (The `default`
  // case is dead code — `Command` is exhaustively covered above it — so its
  // stderr write never actually runs.) Only the top-level rejection handler
  // below (an unexpected throw, not a command refusing) writes to stderr. So
  // `2>/dev/null` on this CLI does not suppress a refusal reason today — do not
  // "fix" a command's own failure message onto stderr without weighing that.
  switch (parsed.command) {
    case "help":
      process.stdout.write(usage);
      return 0;
    case "version": {
      const { default: manifest } = await import("../package.json", {
        with: { type: "json" },
      });
      process.stdout.write(`${manifest.version}\n`);
      return 0;
    }
    case "list": {
      const error = validateListBounds(parsed);
      if (error !== undefined) {
        process.stdout.write(`${error}\n`);
        return 1;
      }
      process.stdout.write(
        renderList({
          entries: allEntries,
          from: parsed.from,
          to: parsed.to,
          json: parsed.json,
          // Colour only when a person is looking at a terminal. `NO_COLOR` is
          // the cross-tool convention for turning it off; a pipe or a file gets
          // plain text so the output stays greppable.
          color:
            process.stdout.isTTY === true &&
            process.env.NO_COLOR === undefined &&
            !parsed.json,
          // Clamped at both ends: a terminal can report an unusably small
          // width (or none at all), and beyond ~100 columns long prose gets
          // harder to read rather than easier.
          width: Math.min(Math.max(process.stdout.columns ?? 80, 60), 100),
        }),
      );
      return 0;
    }
    case "codemod":
      return await runSingleCodemod(parsed, {
        cwd: process.cwd(),
        log: (message) => process.stdout.write(`${message}\n`),
      });
    case "detect": {
      const path = resolveSourcePath(parsed.path, process.cwd());
      const results = await runDetect(path);
      process.stdout.write(
        renderDetect(results, path, {
          // Same rule as `list`: colour only for a TTY, off under `NO_COLOR`
          // or a pipe, decided here rather than read from the environment
          // inside the render function so it stays a pure function of its
          // arguments.
          color:
            process.stdout.isTTY === true && process.env.NO_COLOR === undefined,
          width: Math.min(Math.max(process.stdout.columns ?? 80, 60), 100),
        }),
      );
      return 0;
    }
    case "verify": {
      const path = resolveSourcePath(parsed.path, process.cwd());
      const results = await runVerify(path);
      process.stdout.write(
        renderVerify(results, path, {
          color:
            process.stdout.isTTY === true && process.env.NO_COLOR === undefined,
          width: Math.min(Math.max(process.stdout.columns ?? 80, 60), 100),
        }),
      );
      // Never a pass/fail exit code: an entry that only reports `ok: true`
      // with hints (nothing this run could decide was wrong) is not the same
      // claim as "verified" — the summary line says so in words already, and
      // a 1 here would tempt a CI caller into reading exit-0 as "migration
      // done," which is exactly the false confidence this command exists to
      // avoid.
      return 0;
    }
    case "upgrade": {
      // `-y` accepts every default, and no TTY implies it: CI and agent runs
      // have nobody to answer the prompt. That is also why the dirty-tree guard
      // exists — see git.ts.
      const choose = createChoose({
        yes: parsed.yes,
        isTTY: process.stdin.isTTY === true,
        prompt: (entries) =>
          checkbox({
            message: "Which codemods should run?",
            choices: entries.map((entry) => ({
              name: `${entry.id} — ${entry.title}`,
              value: entry.id,
              checked: true,
            })),
          }),
      });

      return runUpgrade(parsed, {
        ...defaultUpgradeDeps(process.cwd()),
        choose,
      });
    }
    default:
      process.stderr.write(`"${parsed.command}" is not implemented yet\n`);
      return 1;
  }
};

// `process.exitCode` rather than `process.exit()`: exiting explicitly can
// terminate the process before a pending write to stdout has flushed, which on
// POSIX is the common case when stdout is a pipe. Every command exits through
// here, including `list --json` and the upgrade report, so the output that would
// be truncated is the largest output this CLI produces. Nothing keeps a handle
// open, so Node exits on its own once the event loop drains.
main().then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.exitCode = 1;
  },
);
