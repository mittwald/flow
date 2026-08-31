import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { unknownCodemodMessage } from "../catalog/entries.js";
// jscodeshift ships no types for its Runner — `allowJs` in this repo's shared
// tsconfig (packages/typescript-config/base.json) lets a deep import of a
// plain `.js` file resolve without a type error, so no `@ts-expect-error` is
// needed (and adding one here fails the build: "Unused '@ts-expect-error'
// directive").
import { run as runJscodeshift } from "jscodeshift/src/Runner.js";

/**
 * `<packageRoot>/src/migrations` and `<packageRoot>/src/tools`, from either
 * `src/run` or `dist/run`.
 *
 * `dist` mirrors `src`'s directory depth, so one pair of relative paths serves
 * the test run and the published binary. The transforms are not compiled into
 * `dist`: jscodeshift puts a transform through its own babel pipeline, so it
 * wants the `.ts` file.
 */
const migrationsDir = fileURLToPath(
  new URL("../../src/migrations", import.meta.url),
);
const toolsDir = fileURLToPath(new URL("../../src/tools", import.meta.url));

/**
 * The transform file for `id`: `src/migrations/<id>/transform.ts` when `id`
 * names a migration, otherwise `src/tools/<id>.ts`.
 *
 * Deliberately independent of the catalogue: `to-remote-package` is a transform
 * with no catalogue entry (it is a port, not a migration — see `notAMigration`
 * in `src/tests/remoteScope.test.ts`), and it still has to be runnable by id.
 * It lives in `src/tools` rather than `src/migrations` for exactly that reason
 * — there is no migration directory to put it beside.
 */
const transformPath = (id: string): string => {
  const migrationPath = `${migrationsDir}/${id}/transform.ts`;
  return existsSync(migrationPath) ? migrationPath : `${toolsDir}/${id}.ts`;
};

/**
 * Whether `id` names a transform file on disk.
 *
 * `runSingleCodemod` calls this to decide that before it ever reaches this
 * module's own `existsSync` check below.
 */
export const transformExists = (id: string): boolean =>
  existsSync(transformPath(id));

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
  const transform = transformPath(id);

  if (!existsSync(transform)) {
    throw new Error(unknownCodemodMessage(id));
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
