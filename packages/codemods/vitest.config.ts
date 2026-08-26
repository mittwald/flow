import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
    // Every test spawns the real jscodeshift CLI — a Node cold start plus babel
    // per run, and twice per case in the idempotency suite. That is the point:
    // it reproduces how a consumer runs a transform. It also means the default
    // 5s is far too tight on a CI runner, where a single case took 5.2s.
    testTimeout: 60_000,
  },
});
