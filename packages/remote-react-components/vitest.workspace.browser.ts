import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    cacheDir: "node_modules/.vitest-browser",
    test: {
      globalSetup: "src/dev/globalTestSetup.ts",
      include: ["src/**/*.browser.test.{ts,tsx}"],
      browser: {
        providerOptions: {
          launch: {
            devtools: true,
          },
        },
        enabled: true,
        provider: "playwright",
        instances: [{ browser: "chromium" }],
      },
    },
  },
]);
