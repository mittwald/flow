import { createTestServer } from "./createTestServer";

const testServer = await createTestServer();

export async function setup() {
  void testServer.start();
  await new Promise((res) => setTimeout(res, 2000));
}

export async function teardown() {
  await testServer.stop();
}
