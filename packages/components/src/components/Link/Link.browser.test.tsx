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

test("selecting the whole external link does not select any part of the icon", async () => {
  const { container } = await render(<Link target="_blank">mittwald.de</Link>);
  const link = container.querySelector('[role="link"]') as HTMLElement;

  const range = document.createRange();
  range.selectNodeContents(link);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);

  expect(selection?.toString()).toBe("mittwald.de");
});

test("selecting the whole download link does not select any part of the icon", async () => {
  const { container } = await render(<Link download>Download the plans</Link>);
  const link = container.querySelector('[role="link"]') as HTMLElement;

  const range = document.createRange();
  range.selectNodeContents(link);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);

  expect(selection?.toString()).toBe("Download the plans");
});

test("the link icon is excluded from text selection", async () => {
  const { container } = await render(<Link target="_blank">mittwald.de</Link>);
  const icon = container.querySelector("svg") as SVGElement;
  const style = getComputedStyle(icon);

  expect(
    style.getPropertyValue("user-select") ||
      style.getPropertyValue("-webkit-user-select"),
  ).toBe("none");
});
