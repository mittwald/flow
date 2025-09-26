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
    },
    optimizeDeps: {
      force: true,
    },
    mode: "production",
    appType: "spa",
    logLevel: "info",
  });

  return {
    start: async () => {
      await server.listen();
      await server.transformRequest("./main.tsx");
      await server.warmupRequest("./main.tsx");
      server.printUrls();
    },
    stop: async () => {
      await server.close();
      console.log("Remote test server stopped");
    },
  };
};
