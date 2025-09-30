import { createServer } from "vite";

const remoteTestServerPort = 6022;

export const createTestServer = async () => {
  const server = await createServer({
    configFile: "dev/vitest/remote-test-server/vite.config.ts",
    cacheDir: "node_modules/.vitest-browser",
    root: "dev/vitest/remote-test-server",
    server: {
      port: remoteTestServerPort,
      strictPort: true,
      warmup: {
        clientFiles: ["../../../src/tests/*.browser.test.remote.tsx"],
      },
    },
    optimizeDeps: {
      force: true,
    },
  });

  return {
    start: async () => {
      await server.listen();
      server.printUrls();
    },
    stop: async () => {
      await server.close();
      console.log("Remote test server stopped");
    },
  };
};
