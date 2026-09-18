/**
 * The visual corpus, reused UNMODIFIED through the parity environment.
 *
 * Relative to the React package, which is this harness's vitest root: the
 * reused tests load fixtures with paths relative to it
 * (`src/tests/assets/gopher.webp`), so running them from anywhere else breaks
 * on the first upload.
 *
 * No exclude list: a scenario the Vue surface cannot express fails with
 * `UnsupportedScenarioError`, which names the component it could not map. That
 * is the report this harness is for — a silent skip would hide exactly the gap
 * it exists to measure.
 */
export const REUSED_VISUAL_TESTS = ["src/tests/visual/*.browser.test.tsx"];
