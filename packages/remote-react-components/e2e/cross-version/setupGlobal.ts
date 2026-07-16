import { createTestServer } from "../remote-test-server/createTestServer";
import { createCrossVersionServer } from "./createServer";

const referenceServer = await createTestServer();
const candidateServer = await createCrossVersionServer();

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
