import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
// jscodeshift ships no types for its Runner — `allowJs` in this repo's shared
// tsconfig (packages/typescript-config/base.json) lets a deep import of a
// plain `.js` file resolve without a type error, so no `@ts-expect-error` is
// needed (and adding one here fails the build: "Unused '@ts-expect-error'
// directive").
import { run as runJscodeshift } from "jscodeshift/src/Runner.js";

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
  /** Files the transform declined by returning nothing. */
  skipped: number;
  errors: number;
  /** True when jscodeshift accounted for no file at all — see below. */
  processedNothing: boolean;
}

/** The four counters jscodeshift's Runner resolves with. */
interface RunnerStats {
  error: number;
  ok: number;
  nochange: number;
  skip: number;
}

/**
 * Runs one codemod over a path.
 *
 * This drives jscodeshift's `Runner` directly rather than its CLI. The CLI only
 * reports its counts as text, and scraping that text is not safe: `--print`
 * writes the transformed source to stdout _before_ the summary, so a source
 * comment like `// 42 ok` wins a regex looking for `(\d+) ok`. The Runner
 * resolves with the counters as numbers, and it distinguishes `skip` (the
 * transform returned nothing) from `nochange` (it returned identical source) —
 * a difference the CLI's summary and any regex over it both lose.
 *
 * `processedNothing` exists because jscodeshift reports a path with no matching
 * files and a worker that died before touching one the same way: every counter
 * zero, no error. The caller must not render that as "0 files changed", which
 * reads like success.
 */
export const runCodemod = async ({
  id,
  path,
  dry = false,
  print = false,
}: CodemodOptions): Promise<CodemodResult> => {
  const transform = `${transformsDir}/${id}.ts`;

  if (!existsSync(transform)) {
    throw new Error(
      `"${id}" is not a codemod in this package. Run \`flow-codemods list\` to see the available ids.`,
    );
  }

  let stats: RunnerStats;
  try {
    stats = (await runJscodeshift(transform, [path], {
      parser: "tsx",
      silent: true,
      dry,
      print,
      // Without these the walk takes every file under the path. `upgrade` runs
      // codemods after the install, so `node_modules` is freshly populated
      // underneath — and non-JS files fail to parse, which shows up as
      // `errors > 0` and hides the real change count.
      extensions: "js,jsx,ts,tsx,cjs,mjs,cts,mts",
      ignorePattern: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    })) as RunnerStats;
  } catch (error) {
    throw new Error(
      `Running ${id} failed: ${error instanceof Error ? error.message : error}`,
      { cause: error },
    );
  }

  return {
    changed: stats.ok,
    unmodified: stats.nochange,
    skipped: stats.skip,
    errors: stats.error,
    processedNothing:
      stats.ok + stats.nochange + stats.skip + stats.error === 0,
  };
};
