import { runCrossVersion } from "./crossVersionRunner";

/**
 * Iframe cross-version smoke tests: each installed old published bundle is
 * rendered through the CURRENT host over the real iframe connection
 * (@quilted/threads) and its host-rendered HTML compared against an ephemeral
 * reference the current workspace version renders inline per scenario. The
 * shared driver lives in `crossVersionRunner.ts`.
 */
runCrossVersion({
  vitestConfig: "e2e/cross-version/vitest.config.ts",
  tempPrefix: "flow-cross-version-",
  labels: {
    logPrefix: "[cross-version]",
    errorTitlePrefix: "cross-version",
    summaryHeading: "Cross-version smoke tests",
    failureColumn: "failing scenarios",
    outputDelimiter: "CROSSVER_EOF",
  },
});
