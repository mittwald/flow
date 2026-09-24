import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { CodeBlock } from "@/components/CodeBlock";

const showMore = () => page.getByRole("button", { name: "Show more" });
const showLess = () => page.getByRole("button", { name: "Show less" });

const lines = (count: number) =>
  Array.from({ length: count }, (_, i) => `const line${i} = ${i};`).join("\n");

test("without code the children are rendered as preformatted text", async () => {
  await render(<CodeBlock>pnpm install</CodeBlock>);

  await expect.element(page.getByText("pnpm install")).toBeVisible();
  expect(document.querySelector("pre code")?.textContent).toBe("pnpm install");
});

/*
 * Truncation only appears when there is something to truncate – the toggle is
 * the only way back to the full block, so it must not show up for short code.
 */
test("code shorter than the limit gets no toggle", async () => {
  await render(<CodeBlock code={lines(3)} truncateLines />);

  await expect.element(showMore()).not.toBeInTheDocument();
});

test("long code folds behind a toggle that unfolds it again", async () => {
  await render(<CodeBlock code={lines(20)} truncateLines />);

  await expect.element(showMore()).toBeVisible();
  await expect.element(showMore()).toHaveAttribute("aria-expanded", "false");

  await showMore().click();

  await expect.element(showLess()).toBeVisible();
  await expect.element(showLess()).toHaveAttribute("aria-expanded", "true");

  await showLess().click();

  await expect.element(showMore()).toBeVisible();
});

test("a line count sets where the folding starts", async () => {
  await render(<CodeBlock code={lines(5)} truncateLines={4} />);

  await expect.element(showMore()).toBeVisible();
});

test("truncateLines false leaves the block unfolded", async () => {
  await render(<CodeBlock code={lines(20)} />);

  await expect.element(showMore()).not.toBeInTheDocument();
});
