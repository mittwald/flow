import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Detector, Verifier } from "./types.js";

/**
 * `<packageRoot>/{src,dist}/detect` and `.../verify`, resolved from wherever
 * this module itself runs — `src/checks/load.ts` under vitest (the `.ts`
 * sources), `dist/checks/load.js` from the built binary (the compiled `.js`).
 * Both mirror the same directory depth, so one relative path serves both.
 *
 * Unlike `src/transforms` (see the equivalent comment on `transformsDir` in
 * `src/run/jscodeshift.ts`), detect and verify modules compile into `dist`
 * normally: nothing here needs jscodeshift's babel pipeline, so there is no
 * reason to keep them as raw `.ts`.
 */
const detectDir = fileURLToPath(new URL("../detect", import.meta.url));
const verifyDir = fileURLToPath(new URL("../verify", import.meta.url));

/**
 * Whether `<dir>/<id>` exists as either a compiled `.js` (the built binary) or
 * a source `.ts` (running under vitest, straight from `src`).
 */
const exists = (dir: string, id: string): boolean =>
  existsSync(`${dir}/${id}.js`) || existsSync(`${dir}/${id}.ts`);

/**
 * Loads the detector for a catalogue id, or `undefined` when none exists yet.
 *
 * Only a fraction of the catalogue has a module so far — the rest follow in
 * later work. `detect`/`verify` (the CLI commands) must treat a missing module
 * as "nothing to run for this id" rather than a failure, so callers can loop
 * over the whole catalogue without special-casing which ids are covered.
 */
export const loadDetector = async (
  id: string,
): Promise<Detector | undefined> => {
  if (!exists(detectDir, id)) {
    return undefined;
  }
  // `@vite-ignore`: the id is only known at runtime, so this can never be a
  // static specifier a bundler could pre-resolve — under plain Node (the
  // built binary) that is a non-issue, but vitest runs test files through
  // Vite's own module graph, and without the comment Vite tries to rewrite
  // this into a glob import and fails with "Unknown variable dynamic
  // import". The comment tells it to leave the import alone and let Node's
  // loader resolve it, same as the built binary does.
  const detectModule = (await import(
    /* @vite-ignore */ `../detect/${id}.js`
  )) as {
    detector: Detector;
  };
  return detectModule.detector;
};

/** The `verify` counterpart of {@link loadDetector}. */
export const loadVerifier = async (
  id: string,
): Promise<Verifier | undefined> => {
  if (!exists(verifyDir, id)) {
    return undefined;
  }
  // See the matching comment in `loadDetector` above.
  const verifyModule = (await import(
    /* @vite-ignore */ `../verify/${id}.js`
  )) as {
    verifier: Verifier;
  };
  return verifyModule.verifier;
};
