import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { TabNavigation } from "./TabNavigation";
import { Link } from "@/components/Link";

const current = (href: string, currentHref: string) =>
  href === currentHref ? "page" : undefined;

const renderNavigation = (width?: string, currentHref = "#container") =>
  render(
    <div style={width ? { width } : undefined}>
      <TabNavigation aria-label="Project navigation">
        <Link href="#apps" aria-current={current("#apps", currentHref)}>
          Apps
        </Link>
        <Link
          href="#container"
          aria-current={current("#container", currentHref)}
        >
          Container
        </Link>
        <Link href="#domains" aria-current={current("#domains", currentHref)}>
          Domains
        </Link>
        <Link href="#emails" aria-current={current("#emails", currentHref)}>
          E-Mails
        </Link>
        <Link href="#backups" aria-current={current("#backups", currentHref)}>
          Backups
        </Link>
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

test("marks a collapsed current page as the current menu item", async () => {
  renderNavigation("200px", "#backups");

  await userEvent.click(overflowButton());

  /**
   * React Aria filters `aria-current` out of the props forwarded to the DOM, so
   * `MenuItem` exposes the state as `data-current` — the attribute the menu
   * item styling matches on.
   */
  await expect
    .element(page.getByRole("menuitem", { name: "Backups" }))
    .toHaveAttribute("data-current", "true");

  await expect
    .element(page.getByRole("menuitem", { name: "Domains" }))
    .not.toHaveAttribute("data-current");
});

/*
 * The items are measured with `getBoundingClientRect` but compared against a
 * `clientWidth`. In a scaled container those are different units, so without
 * compensation the room is overstated and nothing collapses.
 */
test("collapses overflowing links in a scaled container", async () => {
  await render(
    <div style={{ zoom: 0.5, width: 400 }}>
      <TabNavigation aria-label="Project navigation">
        <Link href="#apps">Apps</Link>
        <Link href="#container">Container</Link>
        <Link href="#domains">Domains</Link>
        <Link href="#emails">E-Mails</Link>
        <Link href="#backups">Backups</Link>
      </TabNavigation>
    </div>,
  );

  await expect.element(overflowButton()).toBeVisible();
});
