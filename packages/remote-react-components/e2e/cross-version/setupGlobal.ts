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

interface SharedServers {
  currentPort: number;
  oldPort: number;
  stop: () => Promise<void>;
}

// Vitest browser mode runs this file's `setup` ONCE PER PROJECT, and a
// single-instance browser config still yields two projects (the root project
// plus the `webkit` instance project), so `setup` fires twice in the same
// process. Naively that starts FOUR Vite dev servers (two current + two old)
// where two suffice — and on the 2-core CI runner those redundant servers all
// force-optimize their (heavy, for the oldest versions) dep graphs at once,
// starving the runner enough to push the iframe @quilted/threads handshake past
// its timeout ("Could not establish remote connection: Timeout reached"). We
// memoize the server pair so both `setup` calls share ONE pair, and ref-count
// the teardowns so the servers stop only after the last project tears down.
let sharedServersPromise: Promise<SharedServers> | undefined;
let refCount = 0;

const startServers = async (): Promise<SharedServers> => {
  const referenceServer = await createCrossVersionServer("current");
  try {
    const candidateServer = await createCrossVersionServer(candidateVersion);
    return {
      currentPort: referenceServer.port,
      oldPort: candidateServer.port,
      stop: async () => {
        await Promise.all([candidateServer.stop(), referenceServer.stop()]);
      },
    };
  } catch (error) {
    await referenceServer.stop();
    throw error;
  }
};

export async function setup({ provide }: TestProject) {
  refCount++;
  // `??=` memoizes the in-flight promise, so concurrent project setups share
  // the same server pair instead of racing two independent startups.
  sharedServersPromise ??= startServers();

  let servers: SharedServers;
  try {
    servers = await sharedServersPromise;
  } catch (error) {
    // A failed startup must not stay cached, or a retry would await the same
    // rejected promise forever.
    refCount--;
    sharedServersPromise = undefined;
    throw error;
  }

  provide("crossVersionCurrentPort", servers.currentPort);
  provide("crossVersionOldPort", servers.oldPort);

  return async () => {
    refCount--;
    if (refCount === 0) {
      sharedServersPromise = undefined;
      await servers.stop();
    }
  };
}
