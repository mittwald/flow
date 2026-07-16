// Vitest config for the cross-version HTML-output comparison suite (host side).
//
// Extends the PACKAGE base vite config (../../vite.config) — NOT this
// directory's vite.config.ts. The host (entries.browser.test.tsx) must run
// against the CURRENT, unaliased renderer; the version alias only applies to
// the REMOTE document served by `createServer.tsx` (which loads
// e2e/cross-version/vite.config.ts itself).
//
// `globalSetup` starts the R1 cross-version server, serving whichever version
// FLOW_CROSS_VERSION selects (`current` for reference generation, an installed
// old version otherwise).
//
// The pure `normalizeHtml` unit test is NOT run here — it lives in the
// package's `unit-dev` project (node env, no server); see ../../vitest.config.ts.
import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vitest/config";
import defaultConfig from "../../vite.config";

export default mergeConfig(defaultConfig, {
  cacheDir: "e2e/cross-version/.vitest/cache/test-browser",
  test: {
    globals: true,
    globalSetup: "e2e/cross-version/setupGlobal.ts",
    // The first entry triggers the remote server's cold dependency
    // optimization + iframe connection, which can exceed the 15s default.
    testTimeout: 60_000,
    include: ["e2e/cross-version/entries.browser.test.tsx"],
    browser: {
      fileParallelism: false,
      enabled: true,
      provider: playwright({
        contextOptions: {
          locale: "de-DE",
        },
      }),
      instances: [
        {
          browser: "webkit",
        },
      ],
    },
  },
});
