import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { HorizontalNavigation } from "./HorizontalNavigation";
import { Link } from "@/components/Link";
import styles from "./HorizontalNavigation.module.scss";

const moreButtonName = /More|Weitere/;

const currentClassName = styles.current;

if (!currentClassName) {
  throw new Error("Missing 'current' class in the HorizontalNavigation styles");
}

const testUi = (width: number, currentPage: "first" | "last" = "first") => (
  <div style={{ width }}>
    <HorizontalNavigation aria-label="Test navigation">
      <Link
        href="#dashboard"
        aria-current={currentPage === "first" ? "page" : undefined}
      >
        Dashboard
      </Link>
      <Link href="#domains">Domains</Link>
      <Link href="#mail">Mail</Link>
      <Link href="#databases">Databases</Link>
      <Link
        href="#settings"
        aria-current={currentPage === "last" ? "page" : undefined}
      >
        Settings
      </Link>
    </HorizontalNavigation>
  </div>
);

test("shows all links and no more button when there is enough space", async () => {
  await render(testUi(1000));

  await expect
    .element(page.getByRole("link", { name: "Dashboard" }))
    .toBeVisible();
  await expect
    .element(page.getByRole("link", { name: "Settings" }))
    .toBeVisible();
  await expect
    .element(page.getByRole("button", { name: moreButtonName }))
    .not.toBeInTheDocument();
});

test("collapses links that do not fit and shows the more button", async () => {
  await render(testUi(260));

  await expect
    .element(page.getByRole("link", { name: "Dashboard" }))
    .toBeVisible();
  await expect
    .element(page.getByRole("link", { name: "Settings" }))
    .not.toBeInTheDocument();
  await expect
    .element(page.getByRole("button", { name: moreButtonName }))
    .toBeVisible();
});

test("shows exactly the collapsed links in the context menu", async () => {
  await render(testUi(260));

  await userEvent.click(page.getByRole("button", { name: moreButtonName }));

  await expect.element(page.getByRole("menu")).toBeVisible();
  await expect
    .element(page.getByRole("menuitem", { name: "Settings" }))
    .toBeVisible();
  await expect
    .element(page.getByRole("menuitem", { name: "Settings" }))
    .toHaveAttribute("href", "#settings");
  await expect
    .element(page.getByRole("menuitem", { name: "Dashboard" }))
    .not.toBeInTheDocument();
});

test("supports keyboard navigation into the context menu", async () => {
  await render(testUi(260));

  const moreButton = page.getByRole("button", { name: moreButtonName });
  await expect.element(moreButton).toBeVisible();

  (moreButton.element() as HTMLElement).focus();
  await userEvent.keyboard("{Enter}");

  await expect.element(page.getByRole("menu")).toBeVisible();

  await userEvent.keyboard("{Escape}");
  await expect.element(page.getByRole("menu")).not.toBeInTheDocument();
});

test("marks the more button as current when the current page is collapsed", async () => {
  await render(testUi(260, "last"));

  await expect
    .element(page.getByRole("button", { name: moreButtonName }))
    .toHaveClass(currentClassName);
});

test("does not mark the more button as current when the current page is visible", async () => {
  await render(testUi(260, "first"));

  await expect
    .element(page.getByRole("link", { name: "Dashboard" }))
    .toBeVisible();
  await expect
    .element(page.getByRole("button", { name: moreButtonName }))
    .not.toHaveClass(currentClassName);
});

test("highlights the current page inside the context menu", async () => {
  await render(testUi(260, "last"));

  await userEvent.click(page.getByRole("button", { name: moreButtonName }));

  await expect
    .element(page.getByRole("menuitem", { name: "Settings" }))
    .toHaveClass(currentClassName);
  await expect
    .element(page.getByRole("menuitem", { name: "Databases" }))
    .not.toHaveClass(currentClassName);
});

test("shows collapsed links again when there is enough space", async () => {
  const { rerender } = await render(testUi(260));

  await expect
    .element(page.getByRole("button", { name: moreButtonName }))
    .toBeVisible();

  await rerender(testUi(1000));

  await expect
    .element(page.getByRole("link", { name: "Settings" }))
    .toBeVisible();
  await expect
    .element(page.getByRole("button", { name: moreButtonName }))
    .not.toBeInTheDocument();
});
