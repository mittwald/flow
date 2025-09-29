import { createServer } from "vite";

const remoteTestServerPort = 6022;

export const createTestServer = async () => {
  const server = await createServer({
    configFile: "dev/vitest/remote-test-server/vite.config.ts",
    // do not cache in node_modules - important for CI
    cacheDir: "../../../.vitest/test-browser",
    root: "dev/vitest/remote-test-server",
    server: {
      hmr: false,
      watch: null,
      port: remoteTestServerPort,
      strictPort: true,
      warmup: {
        clientFiles: ["../../../src/tests/*.browser.test.remote.tsx"],
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
