import { createTestServer } from "./createTestServer";

const testServer = createTestServer();

export async function setup() {
  await testServer.start();
}

export async function teardown() {
  await testServer.stop();
}
