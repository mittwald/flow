import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Warmup", () => {
  renderRemoteTest("standard");
  expect(true).toBe(true);
});
