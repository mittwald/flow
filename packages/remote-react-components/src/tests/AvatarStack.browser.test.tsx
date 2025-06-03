import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("AvatarStack is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const avatarStack = dom.getByTestId("avatarStack");
  await expect.element(avatarStack).toBeInTheDocument();
  expect(avatarStack.element()).toMatchInlineSnapshot(`
    <div
      class="flow--avatar-stack flow--avatar-stack--size-m"
      data-testid="avatarStack"
    >
      <div
        class="flow--avatar flow--avatar--size-m flow--avatar-stack--avatar flow--avatar--blue"
      >
        <div
          aria-label=""
          class="flow--initials flow--avatar--initials"
          data-dynamic-color="blue"
        />
      </div>
      <div
        class="flow--avatar flow--avatar--size-m flow--avatar-stack--avatar flow--avatar--blue"
      >
        <div
          aria-label=""
          class="flow--initials flow--avatar--initials"
          data-dynamic-color="blue"
        />
      </div>
    </div>
  `);
});
