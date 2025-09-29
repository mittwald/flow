import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Warmup is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const text = dom.getByTestId("warmup");
  await expect.element(text).toBeInTheDocument();
});
