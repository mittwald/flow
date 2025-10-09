import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    cacheDir: "dev/vitest/remote-test-server/.vitest/cache/test-browser",
    test: {
      globals: true,
      globalSetup: "dev/vitest/remote-test-server/setupGlobal.ts",
      setupFiles: "dev/vitest/setupFiles.ts",
      include: ["src/**/*.browser.test.{ts,tsx}"],
      browser: {
        fileParallelism: false,
        enabled: true,
        provider: "playwright",
        instances: [
          {
            browser: "chromium",
            context: {
              locale: "de-DE",
            },
          },
        ],
      },
    },
  },
]);
