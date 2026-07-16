// Vitest config for the cross-version HTML-output comparison suite (host side).
//
// Extends the PACKAGE base vite config (../../vite.config) — NOT this
// directory's vite.config.ts. The host (scenarios.browser.test.tsx) must run
// against the CURRENT, unaliased renderer; the version alias only applies to
// the REMOTE document served by `createServer.tsx` (which loads
// e2e/cross-version/vite.config.ts itself).
//
// `globalSetup` starts one cross-version server for the current reference and
// another for the old candidate selected by FLOW_CROSS_VERSION.
//
// The pure `normalizeHtml` unit test is NOT run here — it lives in the
// package's `unit-dev` project (node env, no server); see ../../vitest.config.ts.
import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vitest/config";
import defaultConfig from "../../vite.config";
import {
  CROSS_VERSION_ENV,
  resolveCrossVersionTarget,
} from "./resolveCrossVersionTarget";

const candidateVersion = resolveCrossVersionTarget(
  process.env[CROSS_VERSION_ENV],
).version;

export default mergeConfig(defaultConfig, {
  cacheDir: "e2e/cross-version/.vitest/cache/test-browser",
  // The host bundle renders the current RemoteRenderer; dedupe react so the
  // renderer and the test harness share one React instance (a second copy
  // makes hooks throw "resolveDispatcher() is null").
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  // Expose the old version under test to the host bundle so it can apply
  // version-scoped scenario rules (see entryVersionSupport.ts).
  define: {
    __FLOW_CROSS_VERSION__: JSON.stringify(candidateVersion),
  },
  test: {
    globals: true,
    globalSetup: "e2e/cross-version/setupGlobal.ts",
    // The first scenario triggers the remote server's cold dependency
    // optimization + iframe connection, which can exceed the 15s default.
    testTimeout: 60_000,
    include: ["e2e/cross-version/scenarios.browser.test.tsx"],
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
