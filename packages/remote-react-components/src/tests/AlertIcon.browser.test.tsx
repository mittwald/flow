import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("AlertIcon is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const alertIcon = dom.getByTestId("alertIcon");
  await expect.element(alertIcon).toBeInTheDocument();
  expect(alertIcon.element()).toMatchInlineSnapshot(`
    <svg
      aria-hidden="false"
      aria-label="Status information"
      class="tabler-icon tabler-icon-info-circle flow--icon flow--icon--size-m flow--icon--info"
      data-testid="alertIcon"
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
  `);
});
