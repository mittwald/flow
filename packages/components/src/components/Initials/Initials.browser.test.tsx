import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { Initials } from "@/components/Initials";

const image = () => page.getByRole("img");

/*
 * The initials are decoration; what is announced is the name they were built
 * from, so an avatar reads as the person and not as two letters.
 */
test("the name, not the initials, is the accessible name", async () => {
  await render(<Initials>Leia Organa</Initials>);

  await expect.element(image()).toHaveAccessibleName("Leia Organa");
  expect(image().element().textContent).toBe("LO");
});

test("every initial is hidden from assistive technology", async () => {
  await render(<Initials>Leia Organa</Initials>);

  const parts = document.querySelectorAll("[role='img'] span");

  expect(parts).toHaveLength(2);
  parts.forEach((part) => expect(part).toHaveAttribute("aria-hidden", "true"));
});

// A decorative avatar carries no name of its own at all.
test("aria-hidden drops the name as well", async () => {
  await render(<Initials aria-hidden>Leia Organa</Initials>);

  await expect.element(page.getByRole("img")).not.toBeInTheDocument();
  expect(document.querySelector("[aria-label]")).toBeNull();
});

test("a dynamic color is derived from the name", async () => {
  await render(<Initials useDynamicColor>Leia Organa</Initials>);

  expect(image().element()).toHaveAttribute("data-dynamic-color");
});

test("without the dynamic color no color is set", async () => {
  await render(<Initials>Leia Organa</Initials>);

  expect(image().element()).not.toHaveAttribute("data-dynamic-color");
});
