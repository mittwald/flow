import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("ActionGroup is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const actionGroup = dom.getByTestId("actionGroup");
  await expect.element(actionGroup).toBeInTheDocument();
  expect(actionGroup.element()).toMatchInlineSnapshot(`
    <div
      class="flow--action-group flow--action-group--s"
      data-testid="actionGroup"
      role="group"
    >
      <button
        class="flow--button flow--button--accent flow--button--solid flow--action-group--primary"
        data-rac=""
        data-react-aria-pressable="true"
        id="react-aria-«r0»"
        tabindex="0"
        type="button"
      >
        <span
          class="flow--button--content"
        >
          Create customer
        </span>
      </button>
      <button
        class="flow--button flow--button--secondary flow--button--soft flow--action-group--abort"
        data-rac=""
        data-react-aria-pressable="true"
        id="react-aria-«r2»"
        tabindex="0"
        type="button"
      >
        <span
          class="flow--button--content"
        >
          Abort
        </span>
      </button>
    </div>
  `);
});
