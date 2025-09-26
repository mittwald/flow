import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    optimizeDeps: {
      include: ["react/jsx-dev-runtime"],
    },
    test: {
      globals: true,
      retry: 1,
      globalSetup: "dev/vitest/remote-test-server/setupGlobal.ts",
      setupFiles: "dev/vitest/setupFiles.ts",
      include: ["src/**/*.browser.test.{ts,tsx}"],
      sequence: {
        shuffle: true,
      },
      browser: {
        fileParallelism: false,
        screenshotFailures: false,
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
