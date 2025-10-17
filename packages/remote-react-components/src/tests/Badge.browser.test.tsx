import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Badge is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const badge = dom.getByTestId("badge");
  await expect.element(badge).toBeInTheDocument();
  expect(badge.element()).toMatchInlineSnapshot(`
    <div
      class="flow--badge flow--badge--neutral"
      data-testid="badge"
    >
      <div
        class="flow--badge--content"
      >
        Badge
      </div>
    </div>
  `);
});
