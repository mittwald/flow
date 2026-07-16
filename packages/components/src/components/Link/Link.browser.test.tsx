import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import type { Mock } from "vitest";
import { RouterProvider } from "react-aria-components";
import { Link } from "@/components/Link";
import { Button } from "@/components/Button";

let navigate: Mock;

beforeEach(() => {
  vitest.resetAllMocks();
  navigate = vitest.fn();
});

const href = `${location.origin}/target`;

test("plain link navigates client-side via RouterProvider", async () => {
  render(
    <RouterProvider navigate={navigate}>
      <Link href={href}>Zur App</Link>
    </RouterProvider>,
  );

  await userEvent.click(page.getByText("Zur App"));

  expect(navigate).toHaveBeenCalledWith(href, undefined);
});

test("link with a nested button still navigates client-side", async () => {
  render(
    <RouterProvider navigate={navigate}>
      <Link href={href}>
        <Button data-testid="button" color="secondary" variant="soft">
          Zur App
        </Button>
      </Link>
    </RouterProvider>,
  );

  await userEvent.click(page.getByTestId("button"));

  expect(navigate).toHaveBeenCalledWith(href, undefined);
});
