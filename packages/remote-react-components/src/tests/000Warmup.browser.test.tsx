import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { test } from "vitest";

test("Warmup1 is rendered", async () => {
  renderRemoteTest("warmup1");
});

test("Warmup2 is rendered", async () => {
  renderRemoteTest("warmup2");
});
