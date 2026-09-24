import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../../../core/src/index.ts";
import viteConfig from "./vite.config.ts";

const here = path.dirname(fileURLToPath(import.meta.url));

/*
 * The same browser the corpus harness uses — 1280x720, en-US, reduced motion,
 * webkit only. This compares HTML rather than pixels, so a second engine would
 * only double the runtime.
 */
export default mergeConfig(viteConfig, {
  /* Vite's own option, not a `test` one: vitest keeps its prebundle under it. */
  cacheDir: path.join(here, ".vitest/cache"),
  test: {
    globals: true,
    setupFiles: [path.join(here, "setup.ts")],
    include: [path.join(here, "*.parity.test.tsx")],
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
