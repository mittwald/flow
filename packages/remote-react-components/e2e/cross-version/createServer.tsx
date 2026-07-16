import { createServer as createViteServer } from "vite";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createCrossVersionViteConfig } from "./vite.config";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** Cross-version remote test server built against one explicit package version. */
export const createCrossVersionServer = async (
  version: string,
  port: number,
) => {
  const inlineConfig = createCrossVersionViteConfig(version);

  const server = await createViteServer({
    ...inlineConfig,
    configFile: false,
    cacheDir: join(packageRoot, `.vitest/cache/cross-version-server-${port}`),
    root: join(packageRoot, "e2e/cross-version"),
    server: {
      ...inlineConfig.server,
      port,
      strictPort: true,
      warmup: {
        clientFiles: ["../../src/tests/visual/*.scenarios.tsx"],
      },
    },
    optimizeDeps: {
      ...inlineConfig.optimizeDeps,
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
      console.log(`Cross-version server serving version ${version}`);
      server.printUrls();
    } catch (error) {
      isStarted = false;
      throw error;
    }
  }

  async function stop() {
    await server.close();
    console.log(`Cross-version server for ${version} stopped`);
    isStarted = false;
  }

  return {
    start,
    stop,
  };
};
