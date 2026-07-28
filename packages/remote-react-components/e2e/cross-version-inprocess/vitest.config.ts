import { mergeConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../../../core/src/vitestBrowserTestConfig";
import { REUSED_VISUAL_TESTS } from "./reusedVisualTests";
import viteConfig from "./vite.config";

// Reuses unmodified visual tests by replacing their environments import. The
// browser config is INHERITED from the shared vitestBrowserTestConfig so this
// harness runs exactly like the screenshot tests — same 1280x720 viewport (the
// visual tests render responsively and expect desktop width; a narrow viewport
// hides buttons the tests click), en-US locale (they assert English labels), and
// reduced motion. We only narrow it to webkit + headless + no failure
// screenshots (this harness compares HTML, not pixels).
export default mergeConfig(viteConfig, {
  cacheDir: "e2e/cross-version-inprocess/.vitest/cache/test-browser",
  test: {
    globals: true,
    // A few reused tests are non-deterministic across versions (e.g.
    // PasswordCreationField's "Generate" makes a random password whose
    // rules/strength structure varies), so an occasional structural mismatch is
    // flakiness, not a regression. Retry rescues those; a real version diff
    // still fails deterministically on every attempt.
    retry: 2,
    // setup.ts (first-wins customElements patch) first, then the normal browser
    // setup so reused tests get the same helpers (page.getByLocator, all.css).
    setupFiles: [
      "e2e/cross-version-inprocess/setup.ts",
      "dev/vitest/setupBrowser.ts",
    ],
    include: REUSED_VISUAL_TESTS,
    browser: {
      ...vitestBrowserTestConfig.browser,
      headless: true,
      fileParallelism: false,
      // HTML comparison, not pixels — failure screenshots would only pollute the
      // reused tests' src/**/__screenshots__ dir.
      screenshotFailures: false,
      instances: vitestBrowserTestConfig.browser?.instances?.filter(
        (instance) => instance.browser === "webkit",
      ),
    },
  },
});
