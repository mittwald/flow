// Vitest config for the cross-version HTML-output comparison suite (host side).
//
// Extends the PACKAGE base vite config (../../vite.config) — NOT this
// directory's vite.config.ts. The host (entries.browser.test.tsx) must run
// against the CURRENT, unaliased renderer; the version alias only applies to
// the REMOTE document served by `createServer.tsx` (which loads
// e2e/cross-version/vite.config.ts itself).
//
// `globalSetup` starts both remote servers: the existing e2e server for the
// ephemeral current-version reference and the cross-version server for the old
// candidate selected by FLOW_CROSS_VERSION.
//
// The pure `normalizeHtml` unit test is NOT run here — it lives in the
// package's `unit-dev` project (node env, no server); see ../../vitest.config.ts.
import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vitest/config";
import defaultConfig from "../../vite.config";

export default mergeConfig(defaultConfig, {
  cacheDir: "e2e/cross-version/.vitest/cache/test-browser",
  // The host bundle renders the current RemoteRenderer; dedupe react so the
  // renderer and the test harness share one React instance (a second copy
  // makes hooks throw "resolveDispatcher() is null").
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  // Expose the old version under test to the host bundle so it can apply
  // version-scoped entry exclusions (see excludedEntries.ts).
  define: {
    __FLOW_CROSS_VERSION__: JSON.stringify(
      process.env.FLOW_CROSS_VERSION ?? "",
    ),
  },
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
