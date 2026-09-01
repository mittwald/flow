#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { parseArguments } from "./cli/args.js";
import { createChoose } from "./cli/choose.js";
import { displaySourcePath, runSingleCodemod } from "./cli/codemod.js";
import { resolveInvoke } from "./install.js";
import { defaultListDeps, runList } from "./cli/list.js";
import { defaultUpgradeDeps, runUpgrade } from "./cli/upgrade.js";

const usage = `flow-codemods — migrate a codebase across Flow versions

Usage:
  flow-codemods upgrade [revision]   Bump every Flow dependency, install, run codemods
  flow-codemods <id> [path]          Run a single codemod
  flow-codemods list [revision]      Show the migrations for the whole catalogue, or
                                      for the range a revision would touch

Revision: patch | minor | major | a dist-tag (latest, next) | an exact version.
"upgrade" defaults to minor, which stays inside the current major. "list" has
no default — without one it lists the whole catalogue, offline.

Options:
  -y, --yes          Accept every default. Implied when stdin is not a TTY.
      --allow-dirty  Run even though the working tree has uncommitted changes
      --dry          Do not write files
      --print        Print the transformed output
      --path         Sources to transform
      --json         Machine-readable output for "list"
  -h, --help         Show this text
  -V, --version      Show the version
`;

const main = async (): Promise<number> => {
  const parsed = parseArguments(process.argv.slice(2));

  // Deliberate single ordered report stream: every command-level failure below
  // that a real invocation can hit — `list`'s and `upgrade`'s range resolution,
  // `codemod`'s and `upgrade`'s injected `log` — writes to stdout, interleaved
  // with the rest of that command's normal output, in the order it happened.
  // (The `default` case is dead code — `Command` is exhaustively covered above
  // it — so its stderr write never actually runs.) Only the top-level
  // rejection handler below (an unexpected throw, not a command refusing)
  // writes to stderr. So `2>/dev/null` on this CLI does not suppress a
  // refusal reason today — do not "fix" a command's own failure message onto
  // stderr without weighing that.
  switch (parsed.command) {
    case "help":
      process.stdout.write(usage);
      return 0;
    case "version": {
      // `readFileSync` rather than an import attribute: `with { type: "json" }`
      // was the newest syntax in this package and the only thing forcing the
      // Node floor above what the rest of the code needs. Consumers reach this
      // CLI through `npx`, so that floor is theirs, not the repo's.
      const manifest = JSON.parse(
        readFileSync(new URL("../package.json", import.meta.url), "utf8"),
      ) as { version: string };
      process.stdout.write(`${manifest.version}\n`);
      return 0;
    }
    case "list":
      return await runList(parsed, {
        ...defaultListDeps(process.cwd()),
        // Colour only when a person is looking at a terminal. `NO_COLOR` is
        // the cross-tool convention for turning it off; a pipe or a file gets
        // plain text so the output stays greppable.
        color:
          process.stdout.isTTY === true &&
          process.env.NO_COLOR === undefined &&
          !parsed.json,
        // Clamped at both ends: a terminal can report an unusably small width
        // (or none at all), and beyond ~100 columns long prose gets harder to
        // read rather than easier.
        width: Math.min(Math.max(process.stdout.columns ?? 80, 60), 100),
        // The per-entry command `list` prints has to name the path this project
        // actually uses; hardcoding `src` handed readers a command that fails on
        // any other layout. `--path` wins, otherwise the same `src`-or-cwd
        // choice a real run would make.
        path: displaySourcePath(parsed.path, process.cwd()),
        // `npx` is wrong for a pnpm, Yarn Berry or Bun project. Detecting the
        // manager here costs the bare `list` its "reads no manifest" property —
        // a deliberate trade: a command the reader can actually paste beats the
        // purity of that claim. It still hits no network.
        invoke: await resolveInvoke(process.cwd()),
      });
    case "codemod":
      return await runSingleCodemod(parsed, {
        cwd: process.cwd(),
        log: (message) => process.stdout.write(`${message}\n`),
      });
    case "upgrade": {
      // Loaded here, not at the top: `list` and a single-codemod run never
      // prompt, and paying for the prompt library's module graph on every
      // invocation is the kind of cost a CLI is judged by.
      const { checkbox } = await import("@inquirer/prompts");

      // `-y` accepts every default, and no TTY implies it: CI and agent runs
      // have nobody to answer the prompt. That is also why the dirty-tree guard
      // exists — see git.ts.
      const choose = createChoose({
        yes: parsed.yes,
        isTTY: process.stdin.isTTY === true,
        isCI: process.env.CI !== undefined,
        onCancel: (message) => process.stdout.write(`${message}\n`),
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
