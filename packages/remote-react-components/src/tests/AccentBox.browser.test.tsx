import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("AccentBox is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const accentBox = dom.getByTestId("accentBox");
  await expect.element(accentBox).toBeInTheDocument();
  expect(accentBox.element()).toMatchInlineSnapshot(`
    <div
      class="flow--accent-box flow--accent-box--blue"
      data-testid="accentBox"
    >
      Content
    </div>
  `);
});
