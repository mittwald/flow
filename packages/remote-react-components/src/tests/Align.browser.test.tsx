import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Align is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const align = dom.getByTestId("align");
  await expect.element(align).toBeInTheDocument();
  expect(align.element()).toMatchInlineSnapshot(`
    <div
      class="flow--align"
      data-testid="align"
    >
      <div
        class="flow--avatar flow--avatar--size-m flow--align--avatar flow--avatar--blue"
      >
        <div
          aria-label=""
          class="flow--initials flow--avatar--initials"
          data-dynamic-color="blue"
        />
      </div>
      <span
        class="flow--text flow--text--align-start flow--align--text"
      >
        Max Mustermann
      </span>
    </div>
  `);
});
