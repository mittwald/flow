import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Alert is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const alert = dom.getByTestId("alert");
  await expect.element(alert).toBeInTheDocument();
  expect(alert.element()).toMatchInlineSnapshot(`
    <aside
      class="flow--alert flow--alert--info"
      data-testid="alert"
    >
      <h3
        class="flow--heading flow--heading--s flow--alert--heading"
        data-testid="alertHeading"
      >
        <span
          class="flow--heading--heading-text"
        >
          <svg
            aria-hidden="false"
            aria-label="Status Information"
            class="tabler-icon tabler-icon-info-circle flow--icon flow--heading--icon flow--alert--icon flow--icon--size-m flow--icon--info"
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
              d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"
            />
            <path
              d="M12 9h.01"
            />
            <path
              d="M11 12h1v4h1"
            />
          </svg>
          Email address has been archived
        </span>
        <span
          class="flow--heading--heading-content"
        />
      </h3>
    </aside>
  `);
});
