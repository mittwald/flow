import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    optimizeDeps: {
      include: ["react/jsx-dev-runtime"],
    },
    // do not cache in node_modules - important for CI
    cacheDir: "dev/vitest/remote-test-server/cache/.vitest/test",
    test: {
      globals: true,
      globalSetup: "dev/vitest/remote-test-server/setupGlobal.ts",
      setupFiles: "dev/vitest/setupFiles.ts",
      include: ["src/**/*.browser.test.{ts,tsx}"],

      browser: {
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
