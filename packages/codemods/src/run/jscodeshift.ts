import { existsSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { unknownCodemodMessage } from "../catalog/entries.js";
// jscodeshift ships no types for its Runner — `allowJs` in this repo's shared
// tsconfig (packages/typescript-config/base.json) lets a deep import of a
// plain `.js` file resolve without a type error, so no `@ts-expect-error` is
// needed (and adding one here fails the build: "Unused '@ts-expect-error'
// directive").
import { run as runJscodeshift } from "jscodeshift/src/Runner.js";

/**
 * The package root, from either `src/run` or `dist/run` — both are two levels
 * down, so one expression serves the test run and the published binary.
 */
const packageRoot = fileURLToPath(new URL("../../", import.meta.url));

/**
 * Where a transform for `id` may live, most preferred first.
 *
 * The compiled CommonJS in `dist` comes first, and in a published install it is
 * the only one that works. jscodeshift's worker `require()`s this path; it
 * installs `@babel/register` beforehand, but babel-register's `only` defaults
 * to the current working directory, so a transform inside the consumer's
 * `node_modules` is never claimed by babel. Node's own `.ts` handler takes over
 * and refuses — `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`, no opt-out — and
 * every codemod dies before touching a file. See `tsconfig.transforms.json`.
 *
 * The `.ts` sources stay as a fallback for running out of the repo (`tsx`, the
 * unit tests, `dist` not built yet), where cwd _is_ inside the package and
 * babel-register does claim them. They are no longer published: `files` ships
 * `dist` only, so the path that cannot work is absent from the tarball rather
 * than merely deprioritised.
 *
 * `src/tools` is searched alongside `src/migrations` because
 * `to-remote-package` is a transform with no catalogue entry (a port, not a
 * migration — see `notAMigration` in `src/tests/remoteScope.test.ts`) and still
 * has to be runnable by id.
 */
const candidatePaths = (id: string): string[] => [
  `${packageRoot}dist/migrations/${id}/transform.js`,
  `${packageRoot}dist/tools/${id}.js`,
  `${packageRoot}src/migrations/${id}/transform.ts`,
  `${packageRoot}src/tools/${id}.ts`,
];

/** The transform file for `id`, or `undefined` when no candidate exists. */
const findTransform = (id: string): string | undefined =>
  candidatePaths(id).find((candidate) => existsSync(candidate));

/**
 * The transform file for `id`, falling back to the last candidate so callers
 * that only report a path still have one to name.
 */
const transformPath = (id: string): string =>
  findTransform(id) ?? `${packageRoot}src/tools/${id}.ts`;

/**
 * Whether `id` names a transform file on disk.
 *
 * `runSingleCodemod` calls this to decide that before it ever reaches this
 * module's own `existsSync` check below.
 */
export const transformExists = (id: string): boolean =>
  existsSync(transformPath(id));

/**
 * The extensions the walk takes, and the directories it stays out of.
 *
 * Both are handed to jscodeshift below — without them its walk takes every file
 * under the path, and since `upgrade` runs codemods after the install,
 * `node_modules` is freshly populated underneath; non-JS files then fail to
 * parse, which shows up as `errors > 0` and hides the real change count.
 *
 * `emptySourceFiles` reads the same two constants so that its walk and
 * jscodeshift's agree by construction.
 */
const extensions = ["js", "jsx", "ts", "tsx", "cjs", "mjs", "cts", "mts"];
const ignoredDirectories = ["node_modules", "dist", ".git"];

const sourceExtensions = new Set(
  extensions.map((extension) => `.${extension}`),
);
const ignoredDirectorySet = new Set(ignoredDirectories);

/**
 * How many source files under `path` hold nothing at all.
 *
 * Jscodeshift's worker tests a transform's result for truthiness
 * (`updateStatus(out ? 'nochange' : 'skip', file)`), and on an empty file both
 * `root.toSource()` and `fileInfo.source` are `""` — so an empty file lands in
 * `skip`, indistinguishable there from a transform that declined it.
 *
 * Counted with a walk of our own rather than filtered out of jscodeshift's
 * input: this number only ever explains a count. If the two walks disagree, the
 * worst outcome is a slightly wrong explanation, never a file that should have
 * been transformed and was not.
 */
const emptySourceFiles = (path: string): number => {
  let found = 0;

  const visit = (candidate: string): void => {
    let stats;
    try {
      stats = statSync(candidate);
    } catch {
      // A broken symlink or a file removed mid-walk. jscodeshift skips these
      // too ("Skipping path … which does not exist").
      return;
    }

    if (stats.isDirectory()) {
      for (const child of readdirSync(candidate)) {
        if (!ignoredDirectorySet.has(child)) {
          visit(join(candidate, child));
        }
      }
      return;
    }

    if (stats.size === 0 && sourceExtensions.has(extname(candidate))) {
      found += 1;
    }
  };

  visit(path);
  return found;
};

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
  /**
   * Files the transform declined by returning nothing — empty ones excluded.
   *
   * Both come back from jscodeshift as `skip`. A caller may report this field
   * as "the transform bailed on these"; it must not report `empty` that way.
   */
  skipped: number;
  /** Files with no content, which no transform can do anything with. */
  empty: number;
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
 * reads like success. The load check below removes the most common cause of the
 * second case, so `processedNothing` now means the path far more often than it
 * used to — but not always: a worker can still die for a reason a successful
 * load does not predict, so the flag keeps its deliberately vague name.
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

  // Load the transform here, in this process, before handing its path to
  // jscodeshift.
  //
  // A worker that cannot load the transform dies before it touches a file, and
  // the Runner then resolves with every counter at zero — indistinguishable
  // from a path that matched nothing (see `processedNothing`). The stack trace
  // goes to the worker's stderr, where the summary line the caller prints
  // contradicts it by guessing at the path instead. Loading it up front turns
  // that class of failure into a thrown error naming the real cause, which is
  // the only way a caller can tell "this migration got no run at all" from
  // "this migration had nothing to do".
  //
  // Safe to do: every shipped transform imports nothing but types, so loading
  // one has no side effects and costs a file read.
  try {
    await import(pathToFileURL(transform).href);
  } catch (error) {
    throw new Error(
      `${id} could not be loaded from ${transform}: ${
        error instanceof Error ? error.message : error
      }`,
      { cause: error },
    );
  }

  let stats: RunnerStats;
  try {
    stats = (await runJscodeshift(transform, [path], {
      parser: "tsx",
      silent: true,
      dry,
      print,
      extensions: extensions.join(","),
      ignorePattern: ignoredDirectories.map((name) => `**/${name}/**`),
    })) as RunnerStats;
  } catch (error) {
    throw new Error(
      `Running ${id} failed: ${error instanceof Error ? error.message : error}`,
      { cause: error },
    );
  }

  // Clamped rather than subtracted outright: the two walks are independent, so
  // a file that appeared or emptied between them must not push `skipped` below
  // zero.
  const empty = Math.min(emptySourceFiles(path), stats.skip);

  return {
    changed: stats.ok,
    unmodified: stats.nochange,
    skipped: stats.skip - empty,
    empty,
    errors: stats.error,
    processedNothing:
      stats.ok + stats.nochange + stats.skip + stats.error === 0,
  };
};
