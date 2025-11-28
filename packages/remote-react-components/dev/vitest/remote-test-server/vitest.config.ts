import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vitest/config";
import defaultConfig from "./vite.config";

export default mergeConfig(defaultConfig, {
  cacheDir: "dev/vitest/remote-test-server/.vitest/cache/test-browser",
  test: {
    globals: true,
    globalSetup: "dev/vitest/remote-test-server/setupGlobal.ts",
    include: ["src/**/*.browser.test.{ts,tsx}"],
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
          browser: "chromium",
        },
      ],
    },
  },
});
