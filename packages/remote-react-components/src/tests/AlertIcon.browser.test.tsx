import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("AlertIcon is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const alertIcon = dom.getByTestId("alertIcon");
  await expect.element(alertIcon).toBeInTheDocument();
});
