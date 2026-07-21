import type { TestProject } from "vitest/node";
import { createCrossVersionServer } from "./createServer";
import {
  CROSS_VERSION_ENV,
  resolveCrossVersionServerPackage,
} from "./resolveServerPackage";

declare module "vitest" {
  interface ProvidedContext {
    crossVersionCurrentPort: number;
    crossVersionOldPort: number;
  }
}

const candidateVersion = resolveCrossVersionServerPackage(
  process.env[CROSS_VERSION_ENV],
).version;

export async function setup({ provide }: TestProject) {
  const referenceServer = await createCrossVersionServer("current");

  try {
    const candidateServer = await createCrossVersionServer(candidateVersion);

    provide("crossVersionCurrentPort", referenceServer.port);
    provide("crossVersionOldPort", candidateServer.port);

    return async () => {
      await Promise.all([candidateServer.stop(), referenceServer.stop()]);
    };
  } catch (error) {
    await referenceServer.stop();
    throw error;
  }
}
