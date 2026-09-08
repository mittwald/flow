import { mergeConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../../../core/src/index.ts";
import { REUSED_VISUAL_TESTS } from "./reusedVisualTests.ts";
import { serveFontsLocally } from "../../dev/vitest/serveFontsLocally.ts";
import viteConfig from "./vite.config.ts";

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
    /*
     * One tester iframe for the whole run, for the same reason the package's
     * `visual` project sets it: Playwright's WebKit never releases a removed
     * iframe's document, so vitest's per-file iframe churn leaves every
     * finished file's realm behind — component library, all.css, fonts, last
     * render — until the page dies mid-run (#3119). This harness reuses the
     * same corpus on one browser, and it died at file 60 of 84 with
     * `Browser connection was closed while running tests`.
     *
     * The shared realm suits it: setup.ts's first-wins `customElements.define`
     * patch keeps the OLD flr-* registrations for the whole run, which is
     * exactly one version per run anyway.
     */
    isolate: false,
    /*
     * One page at a time. `browser.fileParallelism` is deprecated in vitest 4
     * in favour of this top-level option.
     */
    fileParallelism: false,
    browser: {
      ...vitestBrowserTestConfig.browser,
      // dev/vitest/setupBrowser.ts calls it, so it has to be registered here
      // too — this config inherits the shared browser config, not the package's.
      commands: {
        ...vitestBrowserTestConfig.browser?.commands,
        serveFontsLocally,
      },
      headless: true,
      // HTML comparison, not pixels — failure screenshots would only pollute the
      // reused tests' src/**/__screenshots__ dir.
      screenshotFailures: false,
      instances: vitestBrowserTestConfig.browser?.instances?.filter(
        (instance) => instance.browser === "webkit",
      ),
    },
  },
});
