import { createCrossVersionServer } from "./createServer";
import { currentServerPort, oldServerPort } from "./crossVersionServerPort";
import {
  CROSS_VERSION_ENV,
  resolveCrossVersionServerPackage,
} from "./resolveServerPackage";

const candidateVersion = resolveCrossVersionServerPackage(
  process.env[CROSS_VERSION_ENV],
).version;
const referenceServer = await createCrossVersionServer(
  "current",
  currentServerPort,
);
const candidateServer = await createCrossVersionServer(
  candidateVersion,
  oldServerPort,
);

export async function setup() {
  await referenceServer.start();

  try {
    await candidateServer.start();
  } catch (error) {
    await referenceServer.stop();
    throw error;
  }
}

export async function teardown() {
  await Promise.all([candidateServer.stop(), referenceServer.stop()]);
}
