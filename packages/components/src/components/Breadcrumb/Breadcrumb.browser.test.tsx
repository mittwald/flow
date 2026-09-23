import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Link } from "@/components/Link";

const renderBreadcrumb = () =>
  render(
    <Breadcrumb>
      <Link href="#org">Rebel Alliance</Link>
      <Link href="#project">Yavin Base</Link>
      <Link href="#page" aria-current="page">
        Hangar
      </Link>
    </Breadcrumb>,
  );

/*
 * Every link is wrapped into a breadcrumb item of its own – the trail is a
 * list, not a row of links.
 */
test("each link becomes an item of the breadcrumb list", async () => {
  await renderBreadcrumb();

  const items = document.querySelectorAll("ol li");

  expect(Array.from(items).map((item) => item.textContent)).toEqual([
    "Rebel Alliance",
    "Yavin Base",
    "Hangar",
  ]);
});

// `Link` coerces `aria-current="page"` to `aria-current="true"`.
test("the last step is marked as the current page", async () => {
  await renderBreadcrumb();

  await expect
    .element(page.getByRole("link", { name: "Hangar" }))
    .toHaveAttribute("aria-current", "true");
  await expect
    .element(page.getByRole("link", { name: "Yavin Base" }))
    .not.toHaveAttribute("aria-current");
});

test("the links keep their targets", async () => {
  await renderBreadcrumb();

  await expect
    .element(page.getByRole("link", { name: "Rebel Alliance" }))
    .toHaveAttribute("href", "#org");
});
