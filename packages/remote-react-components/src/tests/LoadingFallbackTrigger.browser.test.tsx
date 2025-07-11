import { expectNotVisibleFor } from "@/tests/helpers";
import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("LoadingFallbackTrigger triggers suspense on host", async () => {
  const dom = renderRemoteTest("standard");
  const content = dom.getByTestId("content");
  const loadingView = dom.getByTestId("root-loading-view");

  const testIt = async () => {
    // Is loading
    await expect.element(loadingView).toBeVisible();
    await expectNotVisibleFor(content, 100);

    // Loading is done
    await expect.element(content).toBeVisible();
    await expectNotVisibleFor(loadingView, 100);
  };

  await testIt();
  await testIt();
});
