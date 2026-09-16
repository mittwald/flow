import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../../../core/src/index.ts";
import { REUSED_VISUAL_TESTS } from "./reusedVisualTests.ts";
import viteConfig from "./vite.config.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const reactPackage = path.resolve(here, "../../../remote-react-components");

/*
 * The browser config is inherited from the shared one, so the reused tests run
 * exactly as they do in the visual suite — 1280x720 (they render responsively
 * and click buttons a narrow viewport hides), en-US (they assert English
 * labels), reduced motion. Narrowed to webkit and headless: this harness
 * compares HTML, not pixels, so a second browser would only double the runtime.
 */
export default mergeConfig(viteConfig, {
  test: {
    /*
     * The React package, not this one: the corpus is what runs, and it resolves
     * fixture paths against the root. Everything this harness owns is passed
     * absolutely.
     */
    root: reactPackage,
    cacheDir: path.join(here, ".vitest/cache"),
    globals: true,
    setupFiles: [path.join(here, "setup.ts")],
    include: REUSED_VISUAL_TESTS,
    /*
     * One tester iframe for the whole run: Playwright's WebKit never releases a
     * removed iframe's document, so vitest's per-file churn leaves every
     * finished file's realm behind until the page dies mid-run (#3119).
     */
    isolate: false,
    fileParallelism: false,
    testTimeout: 60_000,
    browser: {
      ...vitestBrowserTestConfig.browser,
      headless: true,
      screenshotFailures: false,
      instances: vitestBrowserTestConfig.browser?.instances?.filter(
        (instance) => instance.browser === "webkit",
      ),
    },
  },
});
