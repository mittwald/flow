import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vitest/config";
import { BaseSequencer, type TestSpecification } from "vitest/node";
import { vitestBrowserTestConfig } from "../../../core/src/index.ts";
import { REUSED_VISUAL_TESTS } from "./reusedVisualTests.ts";
import viteConfig from "./vite.config.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const reactPackage = path.resolve(here, "../../../remote-react-components");

/*
 * Files by path, in both passes. Vitest's own order comes from its cache —
 * failures first, then the slowest — and the reference pass writes the very
 * cache the comparison then reads, so the two ran the corpus in different
 * orders. With one iframe for the whole run, what a file finds in the document
 * (an overlay container an earlier modal created) then depends on which pass
 * it is in.
 */
class FileOrderSequencer extends BaseSequencer {
  public override async sort(
    files: TestSpecification[],
  ): Promise<TestSpecification[]> {
    return [...files].sort((left, right) =>
      left.moduleId.localeCompare(right.moduleId),
    );
  }
}

/*
 * The browser config is inherited from the shared one, so the reused tests run
 * exactly as they do in the visual suite — 1280x720 (they render responsively
 * and click buttons a narrow viewport hides), en-US (they assert English
 * labels), reduced motion. Narrowed to webkit and headless: this harness
 * compares HTML, not pixels, so a second browser would only double the runtime.
 */
export default mergeConfig(viteConfig, {
  /*
   * Vite's own option, not a `test` one — vitest keeps its prebundle under it.
   * Without it the prebundle landed in the root's `node_modules/.vite`, which
   * here is the React package's: a rebuilt Vue `dist` does not invalidate a
   * prebundle, and nobody looks for this package's in the other one.
   */
  cacheDir: path.join(here, ".vitest/cache"),
  test: {
    /*
     * The React package, not this one: the corpus is what runs, and it resolves
     * fixture paths against the root. Everything this harness owns is passed
     * absolutely.
     */
    root: reactPackage,
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
    sequence: { sequencer: FileOrderSequencer },
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
