import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

export const transformsDir = fileURLToPath(
  new URL("../transforms", import.meta.url),
);

const jscodeshiftBin = require.resolve("jscodeshift/bin/jscodeshift.js");

/**
 * The jscodeshift CLI exits 0 even when its worker dies before touching a file,
 * so the run is only successful when the summary accounts for the input file.
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
 * Runs a transform the way the CLI does: the real jscodeshift CLI, over a file
 * in a temp directory, with the transform read from `src/transforms`.
 *
 * Spawning the CLI rather than calling the transform in-process is deliberate —
 * it is the invocation `runCodemod` makes, so a transform that only works when
 * called directly fails here too.
 */
export const runTransform = (name: string, source: string): string => {
  const workingDir = mkdtempSync(join(tmpdir(), "flow-codemods-"));
  const inputFile = join(workingDir, "input.tsx");
  writeFileSync(inputFile, source);

  const output = execFileSync(
    process.execPath,
    [
      jscodeshiftBin,
      "-t",
      join(transformsDir, `${name}.ts`),
      "--parser",
      "tsx",
      inputFile,
    ],
    { cwd: workingDir, stdio: "pipe", encoding: "utf8" },
  );

  assertProcessed(name, output);

  return readFileSync(inputFile, "utf8");
};
