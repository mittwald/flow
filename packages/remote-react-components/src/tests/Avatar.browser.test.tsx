import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Avatar is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const avatar = dom.getByTestId("avatar");
  await expect.element(avatar).toBeInTheDocument();
  expect(avatar.element()).toMatchInlineSnapshot(`
    <div
      class="flow--avatar flow--avatar--size-m flow--avatar--blue"
      data-testid="avatar"
    >
      <div
        aria-label=""
        class="flow--initials flow--avatar--initials"
        data-dynamic-color="blue"
      />
    </div>
  `);
});
