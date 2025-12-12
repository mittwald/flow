import { createServer } from "vite";

const remoteTestServerPort = 6022;

export const createTestServer = async () => {
  const server = await createServer({
    configFile: "e2e/remote-test-server/vite.config.ts",
    cacheDir: ".vitest/cache/test-server",
    root: "e2e/remote-test-server",
    server: {
      port: remoteTestServerPort,
      strictPort: true,
      warmup: {
        clientFiles: ["../tests/*.browser.test.remote.tsx"],
      },
    },
    optimizeDeps: {
      force: true,
    },
  });

  let isStarted = false;

  async function start() {
    if (isStarted) {
      return;
    }

    try {
      isStarted = true;
      await server.listen();
      server.printUrls();
    } catch (error) {
      isStarted = false;
      throw error;
    }
  }

  async function stop() {
    await server.close();
    console.log("Remote test server stopped");
    isStarted = false;
  }

  return {
    start,
    stop,
  };
};
