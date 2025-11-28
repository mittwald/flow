import { expectNotVisibleFor } from "@/tests/helpers";
import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("LoadingFallbackTrigger triggers suspense on host", async () => {
  const dom = await renderRemoteTest("standard", {
    skipLoadingViewCheck: true,
  });
  const content = dom.getByTestId("content");
  const loadingView = dom.getByTestId("root-loading-view");

  const testIt = async () => {
    // Is loading
    await expect.element(loadingView).toBeVisible();
    await expectNotVisibleFor(content, 1000);

    // Loading is done
    await expect
      .element(content, {
        timeout: 5000,
      })
      .toBeVisible();
    await expectNotVisibleFor(loadingView, 1000);
  };

  await testIt();
  await testIt();
});
