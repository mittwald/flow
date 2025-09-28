import { createTestServer } from "./createTestServer";

const testServer = await createTestServer();

export async function setup() {
  await testServer.start();
  await fetch(
    "http://localhost:6022/main.tsx?file=tests/Warmup.browser.test.remote.tsx&test=default",
  );
}

export async function teardown() {
  await testServer.stop();
}
