import { createServer } from "vite";

const remoteTestServerPort = 6022;

export const createTestServer = async () => {
  const server = await createServer({
    configFile: "dev/vitest/remote-test-server/vite.config.ts",
    // do not cache in node_modules - important for CI
    cacheDir: "cache/.vitest/test-browser",
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
      await server.listen();
      await server.warmupRequest("./main.tsx");
      server.printUrls();
    },
    stop: async () => {
      await server.close();
      console.log("Remote test server stopped");
    },
  };
};
