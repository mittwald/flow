import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    optimizeDeps: {
      include: ["react/jsx-dev-runtime"],
    },
    cacheDir: "node_modules-1/.vitest-workspace",
    test: {
      globals: true,
      globalSetup: "dev/vitest/remote-test-server/setupGlobal.ts",
      setupFiles: "dev/vitest/setupFiles.ts",
      include: ["src/**/*.browser.test.{ts,tsx}"],
      browser: {
        enabled: true,
        provider: "playwright",
        fileParallelism: false,
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
