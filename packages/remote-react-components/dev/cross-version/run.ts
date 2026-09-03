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
  // The real iframe @quilted/threads handshake intermittently wedges a whole
  // version's run under CI load (every scenario times out together); only a
  // fresh server pair recovers it. Retry each version in-process with fresh
  // servers so one flaky version no longer reds the run — this replaces the
  // old coarse "re-run the ENTIRE suite 3x" CI loop, which never converged
  // because a different version flaked on each attempt.
  attemptsPerVersion: 3,
  labels: {
    logPrefix: "[cross-version]",
    errorTitlePrefix: "cross-version",
    summaryHeading: "Cross-version smoke tests",
    failureColumn: "failing scenarios",
    outputDelimiter: "CROSSVER_EOF",
  },
});
