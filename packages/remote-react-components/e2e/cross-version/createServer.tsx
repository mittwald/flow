import { createServer as createViteServer } from "vite";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createCrossVersionViteConfig } from "./vite.config";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** Cross-version remote test server built against one explicit package version. */
export const createCrossVersionServer = async (version: string) => {
  const inlineConfig = createCrossVersionViteConfig(version);

  const server = await createViteServer({
    ...inlineConfig,
    configFile: false,
    cacheDir: join(
      packageRoot,
      `.vitest/cache/cross-version-server-${version}`,
    ),
    root: join(packageRoot, "e2e/cross-version"),
    server: {
      ...inlineConfig.server,
      port: 0,
      warmup: {
        clientFiles: ["../../src/tests/visual/*.scenarios.tsx"],
      },
    },
    optimizeDeps: {
      ...inlineConfig.optimizeDeps,
      force: true,
    },
  });

  try {
    await server.listen();
  } catch (error) {
    await server.close();
    throw error;
  }

  const address = server.httpServer?.address();
  if (
    address === null ||
    address === undefined ||
    typeof address === "string"
  ) {
    await server.close();
    throw new Error(
      `Cross-version server for ${version} did not bind to a TCP port`,
    );
  }

  const { port } = address;
  console.log(
    `Cross-version server serving version ${version} on port ${port}`,
  );
  server.printUrls();

  async function stop() {
    await server.close();
    console.log(`Cross-version server for ${version} stopped`);
  }

  return {
    port,
    stop,
  };
};
