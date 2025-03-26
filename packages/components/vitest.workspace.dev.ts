import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vitest.config.ts",
    test: {
      include: ["dev/**/*.test.{ts,tsx}"],
      environment: "node",
    },
  },
]);
