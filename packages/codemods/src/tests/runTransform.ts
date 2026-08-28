import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

const migrationsDir = fileURLToPath(new URL("../migrations", import.meta.url));
const toolsDir = fileURLToPath(new URL("../tools", import.meta.url));

const jscodeshiftBin = require.resolve("jscodeshift/bin/jscodeshift.js");

/**
 * The transform file for `name`: `src/migrations/<name>/transform.ts` when that
 * id names a migration, otherwise `src/tools/<name>.ts` — currently only
 * `to-remote-package`, the one transform with no catalogue entry (see
 * `notAMigration` in `remoteScope.test.ts`).
 */
const transformPath = (name: string): string => {
  const migrationPath = join(migrationsDir, name, "transform.ts");
  return existsSync(migrationPath)
    ? migrationPath
    : join(toolsDir, `${name}.ts`);
};

/**
 * Every transform id, from both locations — used by `remoteScope.test.ts` to
 * check the full set against the catalogue, and to check what each transform
 * declares it scopes itself to.
 */
export const listTransformNames = (): string[] => [
  ...readdirSync(migrationsDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(join(migrationsDir, entry.name, "transform.ts")),
    )
    .map((entry) => entry.name),
  ...readdirSync(toolsDir)
    .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
    .map((file) => file.replace(/\.ts$/, "")),
];

/**
 * The jscodeshift CLI exits 0 even when its worker dies before touching a file,
 * so the run is only successful when the summary accounts for the input file.
 *
 * Scraping the CLI's text summary with a regex is unsafe in general — `--print`
 * writes the transformed source to stdout _before_ the summary, so a source
 * comment like `// 42 ok` can win the `(\d+) ok` match (see `runCodemod`'s own
 * doc comment in `src/run/jscodeshift.ts`, which chose the Runner API instead
 * for exactly this reason). It is safe here only because `runTransform` never
 * passes `--print`: no source is ever echoed into the output this regex reads.
 */
const assertProcessed = (name: string, output: string): void => {
  const count = (label: string): number =>
    Number(new RegExp(`(\\d+) ${label}`).exec(output)?.[1] ?? -1);

  const errors = count("errors");
  const processed = count("ok") + count("unmodified");

  if (errors !== 0 || processed !== 1) {
    throw new Error(
      `jscodeshift did not process the input with "${name}".\n\n${output}`,
    );
  }
};

/**
 * Runs a transform through the real jscodeshift CLI binary, over a file in a
 * temp directory, with the transform read from `src/migrations` (or `src/tools`
 * for `to-remote-package`).
 *
 * This is not the invocation `runCodemod` makes — `runCodemod` (in
 * `src/run/jscodeshift.ts`) drives jscodeshift's `Runner` in-process, while
 * this helper spawns the standalone CLI. The two now take different routes, so
 * this is not a fidelity check on `runCodemod` — it is an independent check
 * that the transform works under jscodeshift's normal CLI invocation (the
 * parser flag, the file walk, babel), not only when called directly as a
 * function.
 */
export const runTransform = (name: string, source: string): string => {
  const workingDir = mkdtempSync(join(tmpdir(), "flow-codemods-"));
  const inputFile = join(workingDir, "input.tsx");
  writeFileSync(inputFile, source);

  const output = execFileSync(
    process.execPath,
    [jscodeshiftBin, "-t", transformPath(name), "--parser", "tsx", inputFile],
    { cwd: workingDir, stdio: "pipe", encoding: "utf8" },
  );

  assertProcessed(name, output);

  return readFileSync(inputFile, "utf8");
};
