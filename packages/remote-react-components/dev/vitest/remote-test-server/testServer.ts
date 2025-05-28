import { createTestServer } from "./createTestServer";

const testServer = await createTestServer();
await testServer.start();
