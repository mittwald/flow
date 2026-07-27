import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { TabNavigation } from "./TabNavigation";
import { Link } from "@/components/Link";

const renderNavigation = (width?: string) =>
  render(
    <div style={width ? { width } : undefined}>
      <TabNavigation aria-label="Project navigation">
        <Link href="#apps">Apps</Link>
        <Link href="#container" aria-current="page">
          Container
        </Link>
        <Link href="#domains">Domains</Link>
        <Link href="#emails">E-Mails</Link>
        <Link href="#backups">Backups</Link>
      </TabNavigation>
    </div>,
  );

// The "more" trigger is always rendered but only enters the accessibility tree
// (via `visibility: visible`) once at least one link is collapsed.
const overflowButton = () => page.getByRole("button", { name: /More|Weitere/ });

test("renders a navigation landmark, marks the current page and shows no overflow menu while all links fit", async () => {
  renderNavigation("800px");

  await expect
    .element(page.getByRole("navigation", { name: "Project navigation" }))
    .toBeInTheDocument();

  await expect
    .element(page.getByRole("link", { name: "Apps" }))
    .toBeInTheDocument();

  // `Link` coerces `aria-current="page"` to `aria-current="true"`.
  await expect
    .element(page.getByRole("link", { name: "Container" }))
    .toHaveAttribute("aria-current", "true");

  await expect.element(overflowButton()).not.toBeInTheDocument();
});

test("collapses overflowing links into the overflow menu", async () => {
  renderNavigation("200px");

  // Not enough room for every link → the overflow trigger becomes available.
  await expect.element(overflowButton()).toBeInTheDocument();

  await userEvent.click(overflowButton());

  // The collapsed links are reachable as menu items in the opened menu.
  await expect.element(page.getByRole("menu")).toBeInTheDocument();
  await expect
    .element(page.getByRole("menuitem", { name: "Backups" }))
    .toBeInTheDocument();
});
