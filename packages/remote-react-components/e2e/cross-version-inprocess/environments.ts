// Injected in place of `@/tests/lib/environments` so unmodified visual tests
// run only under the in-process CrossVersion environment.
import type { CrossVersionSkip } from "./skipsVersion";
import { skipsVersion } from "./skipsVersion";
import { crossVersionEnvironment } from "./crossVersionEnvironment";

export const testEnvironments = [crossVersionEnvironment] as const;

declare const __FLOW_CROSS_VERSION__: string;

/**
 * Skip predicate for version-bound reused tests: a test wrapped in
 * `test.skipIf(crossVersion({ below: "<v>" }))` is skipped when this run tests
 * a published version older than `<v>` — either the component it uses didn't
 * exist yet, or the element tree the current host builds from that version's
 * output genuinely differs. The rules live in `skipsVersion`, which is where
 * they are tested; this only supplies the version the run is testing.
 */
export const crossVersion = (skip: CrossVersionSkip): boolean =>
  skipsVersion(__FLOW_CROSS_VERSION__, skip);

export type { CrossVersionSkip } from "./skipsVersion";
