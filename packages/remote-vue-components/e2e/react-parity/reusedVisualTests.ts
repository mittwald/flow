/**
 * The visual corpus, reused UNMODIFIED through the parity environment.
 *
 * Relative to the React package, which is this harness's vitest root: the
 * reused tests load fixtures with paths relative to it
 * (`src/tests/assets/gopher.webp`), so running them from anywhere else breaks
 * on the first upload.
 *
 * The whole corpus, and every file of it runs in the React pass. The Vue pass
 * skips only what `knownGaps.ts` lists as inexpressible, each with a reason,
 * and a full run fails on an entry that no longer names a corpus file or
 * scenario. Anything else the Vue surface cannot express fails with
 * `UnsupportedScenarioError`, naming the component it could not map — a silent
 * skip would hide exactly the gap this harness exists to measure.
 */
export const REUSED_VISUAL_TESTS = ["src/tests/visual/*.browser.test.tsx"];
