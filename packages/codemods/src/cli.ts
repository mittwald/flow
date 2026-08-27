#!/usr/bin/env node
import { parseArguments } from "./cli/args.js";

const usage = `flow-codemods — migrate a codebase across Flow versions

Usage:
  flow-codemods upgrade [revision]   Bump every Flow dependency, install, run codemods
  flow-codemods <id> [path]          Run a single codemod
  flow-codemods list                 Show the migrations for a version range

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
    default:
      process.stderr.write(`"${parsed.command}" is not implemented yet\n`);
      return 1;
  }
};

main().then(
  (code) => process.exit(code),
  (error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  },
);
