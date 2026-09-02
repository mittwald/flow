import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "src/tests/**/*.test.ts",
      "src/migrations/**/*.test.ts",
      "src/tools/**/*.test.ts",
    ],
    // Most suites are fast, but the transform-fixture and idempotency suites
    // spawn the real jscodeshift CLI (via `runTransform.ts`) or drive its
    // `Runner` in-process (via `runCodemod`) — a Node cold start plus babel per
    // run, and twice per case in the idempotency suite. The default 5s is far
    // too tight on a CI runner for those, where a single case took 5.2s.
    testTimeout: 60_000,
  },
});
