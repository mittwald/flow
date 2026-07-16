import { createServer as createViteServer } from "vite";
import { crossVersionServerPort } from "./crossVersionServerPort";
import { resolveCrossVersionTarget } from "./resolveCrossVersionTarget";

/**
 * Cross-version remote test server. Serves a remote document (`index.html` +
 * `main.tsx`) built against an installed OLD version of
 * `@mittwald/flow-remote-react-components` (selected via `FLOW_CROSS_VERSION`,
 * see `resolveCrossVersionTarget`). The host-side browser test loads this
 * document into an iframe through `RemoteRenderer` and asserts the old version
 * renders/serializes correctly against the current host.
 *
 * Structure mirrors `e2e/remote-test-server/createTestServer.tsx`.
 */
export const createCrossVersionServer = async () => {
  const target = resolveCrossVersionTarget();

  const server = await createViteServer({
    configFile: "e2e/cross-version/vite.config.ts",
    cacheDir: ".vitest/cache/cross-version-server",
    root: "e2e/cross-version",
    server: {
      port: crossVersionServerPort,
      strictPort: true,
      warmup: {
        clientFiles: ["./tests/*.browser.test.remote.tsx"],
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
      console.log(`Cross-version server serving version ${target.version}`);
      server.printUrls();
    } catch (error) {
      isStarted = false;
      throw error;
    }
  }

  async function stop() {
    await server.close();
    console.log("Cross-version server stopped");
    isStarted = false;
  }

  return {
    start,
    stop,
  };
};
