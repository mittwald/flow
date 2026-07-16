import { createCrossVersionServer } from "./createServer";

const server = await createCrossVersionServer();

export async function setup() {
  await server.start();
}

export async function teardown() {
  await server.stop();
}
