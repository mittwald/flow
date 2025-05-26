import { createServer } from "vite";

const remoteTestServerPort = 6022;

export const createTestServer = () => {
  const testServer = {
    start: async () => {
      const server = await createServer({
        configFile: "dev/vitest/remote-test-server/vite.config.ts",
        cacheDir: "node_modules/.vitest-browser",
        root: "dev/vitest/remote-test-server",
        server: {
          port: remoteTestServerPort,
          strictPort: true,
        },
      });

      testServer.stop = async () => {
        await server.close();
        console.log("Remote test server stopped");
      };

      await server.listen();
      server.printUrls();
    },
    stop: async () => {
      // default; do nothing
    },
  };

  return testServer;
};
