import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Alert is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const alert = dom.getByTestId("alert");
  await expect.element(alert).toBeInTheDocument();
  const alertHeading = dom.getByTestId("alertHeading");
  await expect.element(alertHeading).toBeInTheDocument();
  expect(alert.element()).toHaveTextContent("Email address has been archived");
  expect(alertHeading.element()).toHaveClass("flow--alert--heading");
});
