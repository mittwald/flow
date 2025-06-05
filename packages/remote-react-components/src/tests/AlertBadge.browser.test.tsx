import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("AlertBadge is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const alertBadge = dom.getByTestId("alertBadge");
  await expect.element(alertBadge).toBeInTheDocument();
  expect(alertBadge.element()).toHaveClass("flow--alert-badge--info");
  expect(alertBadge.element()).toHaveTextContent("Info");
});
