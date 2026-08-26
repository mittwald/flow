import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
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
      `jscodeshift did not process the input with "${name}". ` +
        `A transform that requires a sibling file fails like this, because ` +
        `jscodeshift runs it from a directory of its own.\n\n${output}`,
    );
  }
};

/**
 * Runs a transform the way a consumer does.
 *
 * The documented invocation passes a raw GitHub URL, and jscodeshift downloads
 * that into a file in the OS temp dir and requires it from there. Copying the
 * transform into a temp directory of its own reproduces that exactly: a
 * transform that reaches for a sibling file fails here the same way it fails
 * for a consumer.
 */
export const runTransform = (name: string, source: string): string => {
  const workingDir = mkdtempSync(join(tmpdir(), "flow-codemods-"));

  // The name jscodeshift itself gives the file it downloaded.
  const transformFile = join(workingDir, "jscodeshift-transform.ts");
  copyFileSync(join(transformsDir, `${name}.ts`), transformFile);

  const inputFile = join(workingDir, "input.tsx");
  writeFileSync(inputFile, source);

  const output = execFileSync(
    process.execPath,
    [jscodeshiftBin, "-t", transformFile, "--parser", "tsx", inputFile],
    { cwd: workingDir, stdio: "pipe", encoding: "utf8" },
  );

  assertProcessed(name, output);

  return readFileSync(inputFile, "utf8");
};
