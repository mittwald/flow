import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vitest/config";
import {
  EXCLUDED_VISUAL_TESTS,
  REUSED_VISUAL_TESTS,
} from "./reusedVisualTests";
import viteConfig from "./vite.config";

// Reuses unmodified visual tests by replacing their environments import.
export default mergeConfig(viteConfig, {
  cacheDir: "e2e/cross-version-inprocess/.vitest/cache/test-browser",
  test: {
    globals: true,
    // setup.ts (first-wins customElements patch) first, then the normal browser
    // setup so reused tests get the same helpers (page.getByLocator, all.css).
    setupFiles: [
      "e2e/cross-version-inprocess/setup.ts",
      "dev/vitest/setupBrowser.ts",
    ],
    include: REUSED_VISUAL_TESTS,
    exclude: EXCLUDED_VISUAL_TESTS,
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
