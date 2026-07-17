import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vitest/config";
import { REUSED_VISUAL_TESTS } from "./reusedVisualTests";
import viteConfig from "./vite.config";

// Reuses unmodified visual tests by replacing their environments import.
export default mergeConfig(viteConfig, {
  cacheDir: "e2e/cross-version-inprocess/.vitest/cache/test-browser",
  test: {
    globals: true,
    setupFiles: ["e2e/cross-version-inprocess/setup.ts"],
    include: REUSED_VISUAL_TESTS,
    browser: {
      enabled: true,
      headless: true,
      fileParallelism: false,
      // This harness compares HTML, not pixels. Failure screenshots would add
      // nothing and would land in the reused tests' src/**/__screenshots__ dir,
      // polluting the real visual baselines.
      screenshotFailures: false,
      provider: playwright({ contextOptions: { locale: "de-DE" } }),
      instances: [{ browser: "webkit" }],
    },
  },
});
