import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { Markdown } from "@/components/Markdown";

const renderMarkdown = (markdown: string, headingOffset?: number) =>
  render(<Markdown headingOffset={headingOffset}>{markdown}</Markdown>);

test("a paragraph becomes a paragraph element", async () => {
  await renderMarkdown("The Death Star plans are on Scarif.");

  await expect
    .element(page.getByText("The Death Star plans are on Scarif."))
    .toBeVisible();
  expect(document.querySelector("p")).not.toBeNull();
});

test("a heading becomes a heading of the matching level", async () => {
  await renderMarkdown("# Briefing\n\n## Objective");

  expect(document.querySelector("h1")?.textContent).toContain("Briefing");
  expect(document.querySelector("h2")?.textContent).toContain("Objective");
});

/*
 * The offset lets a document sit under a heading the markdown does not know
 * about, without the levels skipping a step.
 */
test("headingOffset shifts every level", async () => {
  await renderMarkdown("# Briefing\n\n## Objective", 1);

  expect(document.querySelector("h1")).toBeNull();
  expect(document.querySelector("h2")?.textContent).toContain("Briefing");
  expect(document.querySelector("h3")?.textContent).toContain("Objective");
});

test("the offset stops at the last heading level", async () => {
  await renderMarkdown("###### Footnote", 3);

  expect(document.querySelector("h6")?.textContent).toContain("Footnote");
});

// Markdown can come from anywhere, so its links leave the current page.
test("a link opens in a new tab", async () => {
  await renderMarkdown("[The archive](https://example.com/archive)");

  const link = page.getByRole("link", { name: "The archive" });

  await expect
    .element(link)
    .toHaveAttribute("href", "https://example.com/archive");
  await expect.element(link).toHaveAttribute("target", "_blank");
});

test("a fenced block becomes a code block", async () => {
  await renderMarkdown('```json\n{ "force": true }\n```');

  await expect.element(page.getByText(/"force"/)).toBeVisible();
});

test("a thematic break becomes a separator", async () => {
  await renderMarkdown("Before\n\n---\n\nAfter");

  await expect.element(page.getByRole("separator")).toBeInTheDocument();
});

// GitHub-flavoured markdown is on, so tables and strikethrough work.
test("a table is rendered", async () => {
  await renderMarkdown("| Ship | Crew |\n| --- | --- |\n| X-Wing | 1 |");

  await expect.element(page.getByRole("table")).toBeInTheDocument();
  await expect.element(page.getByText("X-Wing")).toBeVisible();
});
