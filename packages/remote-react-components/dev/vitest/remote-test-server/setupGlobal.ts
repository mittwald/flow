import { createTestServer } from "./createTestServer";

const testServer = await createTestServer();

export async function setup() {
  void testServer.start();
}

export async function teardown() {
  await testServer.stop();
}
