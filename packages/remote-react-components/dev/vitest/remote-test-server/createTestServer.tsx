import { createServer } from "vite";

const remoteTestServerPort = 6022;

export const createTestServer = async () => {
  const server = await createServer({
    configFile: "dev/vitest/remote-test-server/vite.config.ts",
    cacheDir: "node_modules-2/.vitest-test-server",
    root: "dev/vitest/remote-test-server",
    server: {
      hmr: false,
      watch: null,
      port: remoteTestServerPort,
      strictPort: true,
      warmup: {
        clientFiles: ["./tests/*.browser.test.remote.tsx"],
      },
    },
    optimizeDeps: {
      force: true,
    },
  });

  return {
    start: async () => {
      await server.listen();
    },
    stop: async () => {
      await server.close();
    },
  };
};
