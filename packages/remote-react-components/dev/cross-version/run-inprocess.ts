import { join } from "node:path";
import { packageRoot, runCrossVersion } from "./crossVersionRunner";

/**
 * In-process cross-version tests: the broad visual-test corpus is reused with
 * the OLD remote package rendering through the CURRENT host in one realm, its
 * structure-only HTML compared against a `current` reference regenerated up
 * front (`--update`, into `.refs`). The shared driver lives in
 * `crossVersionRunner.ts`.
 */
runCrossVersion({
  vitestConfig: "e2e/cross-version-inprocess/vitest.config.ts",
  tempPrefix: "flow-cross-version-inprocess-",
  labels: {
    logPrefix: "[cross-version-inprocess]",
    errorTitlePrefix: "cross-version in-process",
    summaryHeading: "Cross-version in-process tests",
    failureColumn: "failing tests",
    outputDelimiter: "CROSSVER_INPROCESS_EOF",
  },
  reference: {
    refDirectory: join(packageRoot, "e2e/cross-version-inprocess/.refs"),
  },
});
