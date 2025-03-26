import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vitest.config.ts",
    test: {
      include: ["src/**/*.unit.test.{ts,tsx}"],
      environment: "happy-dom",
    },
  },
]);
