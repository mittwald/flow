import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import type { Mock } from "vitest";
import { createRef } from "react";
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

  const button = page.getByTestId("button");

  await expect.element(button).toHaveAttribute("data-testid", "button");
  expect((await button.element()).tagName).toBe("SPAN");

  await userEvent.click(button);

  expect(navigate).toHaveBeenCalledWith(href, undefined);
});

test("a ref on a button in a link points to the rendered span", async () => {
  const ref = createRef<HTMLButtonElement>();

  render(
    <Link href={href}>
      <Button ref={ref}>Zur App</Button>
    </Link>,
  );

  await expect.element(page.getByText("Zur App")).toBeInTheDocument();
  expect(ref.current?.tagName).toBe("SPAN");
});

test("button in a disabled link exposes its disabled state", async () => {
  render(
    <Link href={href} isDisabled>
      <Button data-testid="button">Zur App</Button>
    </Link>,
  );

  await expect
    .element(page.getByTestId("button"))
    .toHaveAttribute("data-disabled", "true");
});
