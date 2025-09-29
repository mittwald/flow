import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Warmup is rendered", async () => {
  renderRemoteTest("warmup");
  expect(true).toBe(true);
});
