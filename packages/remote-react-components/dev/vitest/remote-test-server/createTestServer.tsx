import { createServer } from "vite";

const remoteTestServerPort = 6022;

export const createTestServer = async () => {
  const server = await createServer({
    configFile: "dev/vitest/remote-test-server/vite.config.ts",
    cacheDir: "node_modules/.vitest-remote-test-server",
    root: "dev/vitest/remote-test-server",
    server: {
      port: remoteTestServerPort,
      strictPort: true,
      hmr: false,
      watch: null,
      warmup: {
        clientFiles: ["../../../src/**/*.browser.test.remote.tsx"],
      },
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
