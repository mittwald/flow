import { createServer } from "vite";

export async function setup() {
  console.log("Setting up");
  const server = await createServer({
    configFile: "vite.browser.config.ts",
  });
  await server.listen(6022);
}

export function teardown() {
  console.log("Tear down");
}
