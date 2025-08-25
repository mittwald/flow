import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Accordion is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const accordion = dom.getByTestId("accordion");
  await expect.element(accordion).toBeInTheDocument();
  expect(accordion.element()).toMatchInlineSnapshot(`
    <div
      class="flow--accordion"
      data-testid="accordion"
    >
      <h4
        class="flow--heading flow--accordion--header"
      >
        <span
          class="flow--heading--heading-text"
        >
          <button
            aria-controls="«r1»"
            aria-expanded="false"
            class="flow--accordion--header-button"
            data-rac=""
            data-react-aria-pressable="true"
            id="react-aria-«r2»"
            tabindex="0"
            type="button"
          >
            Heading
            <svg
              aria-hidden="true"
              class="tabler-icon tabler-icon-chevron-down flow--icon flow--button--icon flow--accordion--chevron flow--icon--size-m"
              fill="none"
              focusable="false"
              height="24"
              role="img"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9l6 6l6 -6"
              />
            </svg>
          </button>
        </span>
        <span
          class="flow--heading--heading-content"
        />
      </h4>
      <div
        aria-labelledby="«r0»"
        class="flow--accordion--content"
        hidden=""
        id="«r1»"
        role="region"
      />
    </div>
  `);
});
