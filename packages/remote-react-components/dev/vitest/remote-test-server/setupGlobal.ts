import { createTestServer } from "./createTestServer";

const testServer = await createTestServer();

export async function setup() {
  await testServer.start();
}

export async function teardown() {
  await testServer.stop();
}
