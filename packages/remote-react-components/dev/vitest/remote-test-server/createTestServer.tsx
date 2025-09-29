import { createServer } from "vite";

const remoteTestServerPort = 6022;

export const createTestServer = async () => {
  const server = await createServer({
    cacheDir: "node_modules/.vitest-remote-test-server",
    logLevel: "info",
    root: "dev/vitest/remote-test-server",
    optimizeDeps: {
      force: true,
    },
    server: {
      port: remoteTestServerPort,
      strictPort: true,
      hmr: false,
      watch: null,
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
