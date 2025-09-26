import { createServer } from "vite";

const remoteTestServerPort = 6022;

const timeout = (ms: number) =>
  new Promise((ignored, reject) => setTimeout(() => reject("Timeout"), ms));

export const createTestServer = async () => {
  const server = await createServer({
    configFile: "dev/vitest/remote-test-server/vite.config.ts",
    cacheDir: "node_modules/.vitest-browser",
    root: "dev/vitest/remote-test-server",
    server: {
      port: remoteTestServerPort,
      strictPort: true,
    },
    optimizeDeps: {
      force: true,
    },
  });

  return {
    start: async () => {
      const startWarmupWithTimeout = () =>
        Promise.race([
          server.warmupRequest(
            "./main.tsx?file=tests/Warmup.browser.test.remote.tsx&test=default",
          ),
          timeout(5_000),
        ]);

      await server.listen();
      await startWarmupWithTimeout().catch(startWarmupWithTimeout);

      server.printUrls();
    },
    stop: async () => {
      await server.close();
      console.log("Remote test server stopped");
    },
  };
};
