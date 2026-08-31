import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // `*.node.test.ts` belongs to `test:links`, which runs the files under the
    // `node:test` runner. Vitest cannot execute them (`No test suite found`)
    // and `node --test` cannot execute vitest files, so the two globs must stay
    // disjoint — same idea as the `*.browser.test.tsx` infix in `components`.
    exclude: ["**/node_modules/**", "**/dist/**", "src/**/*.node.test.ts"],
  },
});
