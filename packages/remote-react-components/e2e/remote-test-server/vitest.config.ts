import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vitest/config";
import defaultConfig from "./vite.config";

export default mergeConfig(defaultConfig, {
  cacheDir: "e2e/remote-test-server/.vitest/cache/test-browser",
  test: {
    globals: true,
    globalSetup: "e2e/remote-test-server/setupGlobal.ts",
    include: ["e2e/tests/*.browser.test.{ts,tsx}"],
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
          // Should be changed to Chromium when flakiness is resolved
          browser: "firefox",
        },
      ],
    },
  },
});
