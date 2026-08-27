import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

/**
 * `<packageRoot>/src/transforms`, from either `src/run` or `dist/run`.
 *
 * `dist` mirrors `src`'s directory depth, so one relative path serves the test
 * run and the published binary. The transforms are not compiled into `dist`:
 * jscodeshift puts a transform through its own babel pipeline, so it wants the
 * `.ts` file.
 */
const transformsDir = fileURLToPath(
  new URL("../../src/transforms", import.meta.url),
);

const jscodeshiftBin = require.resolve("jscodeshift/bin/jscodeshift.js");

export interface CodemodOptions {
  /** A catalogue id — the transform file name without its extension. */
  id: string;
  /** File or directory to transform. */
  path: string;
  dry?: boolean;
  print?: boolean;
}

export interface CodemodResult {
  changed: number;
  unmodified: number;
  errors: number;
  /** The CLI's own summary, for reporting a failure verbatim. */
  output: string;
}

const count = (output: string, label: string): number =>
  Number(new RegExp(`(\\d+) ${label}`).exec(output)?.[1] ?? 0);

/**
 * Runs one codemod over a path.
 *
 * Jscodeshift exits 0 even when its worker dies before touching a file, so the
 * counts in the summary — not the exit code — are what says whether anything
 * ran.
 */
export const runCodemod = ({
  id,
  path,
  dry = false,
  print = false,
}: CodemodOptions): CodemodResult => {
  const transform = `${transformsDir}/${id}.ts`;

  if (!existsSync(transform)) {
    throw new Error(
      `"${id}" is not a codemod in this package. Run \`flow-codemods list\` to see the available ids.`,
    );
  }

  const args = [
    jscodeshiftBin,
    "-t",
    transform,
    "--parser",
    "tsx",
    ...(dry ? ["--dry"] : []),
    ...(print ? ["--print"] : []),
    path,
  ];

  const output = execFileSync(process.execPath, args, {
    encoding: "utf8",
    stdio: "pipe",
  });

  return {
    changed: count(output, "ok"),
    unmodified: count(output, "unmodified"),
    errors: count(output, "errors"),
    output,
  };
};
