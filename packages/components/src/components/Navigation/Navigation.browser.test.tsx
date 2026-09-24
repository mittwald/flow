import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { Navigation } from "@/components/Navigation";
import { Link } from "@/components/Link";
import { Badge } from "@/components/Badge";

const renderNavigation = () =>
  render(
    <Navigation aria-label="Factions">
      <Link href="#jedi">Jedi Order</Link>
      <Link href="#rebels" aria-current="page">
        Rebel Alliance
      </Link>
      <Link href="#empire">
        Galactic Empire
        <Badge>New</Badge>
      </Link>
    </Navigation>,
  );

test("the links become a list inside the navigation landmark, in order", async () => {
  await renderNavigation();

  await expect
    .element(page.getByRole("navigation", { name: "Factions" }))
    .toBeInTheDocument();

  const items = document.querySelectorAll("nav li");

  expect(Array.from(items).map((item) => item.textContent)).toEqual([
    "Jedi Order",
    "Rebel Alliance",
    "Galactic EmpireNew",
  ]);
});

// `Link` coerces `aria-current="page"` to `aria-current="true"`.
test("the current link is marked", async () => {
  await renderNavigation();

  await expect
    .element(page.getByRole("link", { name: "Rebel Alliance" }))
    .toHaveAttribute("aria-current", "true");
});

/*
 * A bare text node would be an anonymous flex item that no rule can truncate,
 * so the navigation gives every text label an element of its own.
 */
test("a text label is wrapped in an element of its own", async () => {
  await renderNavigation();

  const label = document.querySelector("nav li a span");

  expect(label?.textContent).toBe("Jedi Order");
});
