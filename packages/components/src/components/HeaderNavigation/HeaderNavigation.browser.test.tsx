import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import { Link } from "@/components/Link";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { IconSearch, IconStar } from "@/components/Icon/components/icons";

const renderNavigation = () =>
  render(
    <HeaderNavigation aria-label="Header navigation">
      <Link href="#">Docs</Link>
      <Link href="https://www.mittwald.de" target="_blank" aria-label="Website">
        <Button>
          <Icon>
            <IconStar data-testid="link-icon" />
          </Icon>
        </Button>
      </Link>
      <Button aria-label="Search">
        <IconSearch />
      </Button>
    </HeaderNavigation>,
  );

test("a button in a link renders like the icon buttons", async () => {
  await renderNavigation();

  const link = await page.getByRole("link", { name: "Website" }).element();
  const button = await page.getByRole("button", { name: "Search" }).element();
  const linkButton = link.firstElementChild as HTMLElement;

  expect(link.querySelector("button")).toBeNull();
  expect(linkButton.tagName).toBe("SPAN");
  expect([...linkButton.classList].sort()).toEqual(
    [...button.classList].sort(),
  );
  expect(link.getBoundingClientRect().width).toBe(
    button.getBoundingClientRect().width,
  );
  expect(link.getBoundingClientRect().height).toBe(
    button.getBoundingClientRect().height,
  );
});

test("a hovered button in a link looks like a hovered icon button", async () => {
  await renderNavigation();

  const link = page.getByRole("link", { name: "Website" });
  const button = page.getByRole("button", { name: "Search" });
  const linkElement = await link.element();
  const linkButton = linkElement.firstElementChild as HTMLElement;
  const backgroundColor = (element: Element) =>
    getComputedStyle(element).backgroundColor;

  await userEvent.hover(button);
  await expect
    .poll(async () => backgroundColor(await button.element()))
    .not.toBe("rgba(0, 0, 0, 0)");
  const hoveredButtonColor = backgroundColor(await button.element());

  await userEvent.hover(link);
  await expect.poll(() => backgroundColor(linkButton)).toBe(hoveredButtonColor);
  expect(backgroundColor(linkElement)).toBe("rgba(0, 0, 0, 0)");
});

test("an external link with a button shows only the given icon", async () => {
  await renderNavigation();

  const link = await page.getByRole("link", { name: "Website" }).element();

  expect(link.querySelectorAll("svg")).toHaveLength(1);
  await expect.element(page.getByTestId("link-icon")).toBeVisible();
});

test("a text link keeps its emulated bold width", async () => {
  await renderNavigation();

  const link = await page.getByRole("link", { name: "Docs" }).element();

  expect(link.querySelector('[aria-hidden="true"]')?.textContent).toBe("Docs");
});
