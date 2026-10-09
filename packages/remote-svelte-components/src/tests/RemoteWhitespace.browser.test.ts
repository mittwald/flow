import { expect, test, afterEach } from "vitest";
import WhitespaceLayout from "./fixtures/WhitespaceLayout.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * Svelte keeps a text node wherever the source has whitespace between two
 * nodes. Between two block-level HTML elements it drops them, but a `flr-*`
 * element is a custom element and counts as inline — so a template written the
 * way every Svelte template is written puts a text node into the remote tree,
 * and the host renders it as a child of the Flow component. Inside a `Section`,
 * which lays out with `flex`, each one is an anonymous flex item and a second
 * gap.
 *
 * `normalizeWhitespace.ts` blanks them, and only them: a space an author wrote
 * between two expressions is content.
 */
afterEach(() => cleanupRemote());

const sectionIn = (host: Element) => {
  const sections = [...host.querySelectorAll(".flow--section")];
  return sections[sections.length - 1];
};

test("template whitespace does not reach the host as a child", async () => {
  const { host } = renderRemote(WhitespaceLayout);

  await expect
    .poll(() => sectionIn(host)?.textContent, { timeout: 5000 })
    .toContain("Squadron");

  const blankChildren = [...(sectionIn(host)?.childNodes ?? [])].filter(
    (node) =>
      node.nodeType === Node.TEXT_NODE && /^\s+$/.test(node.nodeValue ?? ""),
  );

  expect(
    blankChildren,
    "A whitespace text node reached the host as a child of the Section — see normalizeWhitespace.ts.",
  ).toEqual([]);
});

test("a space an author wrote between two expressions survives", async () => {
  const { host } = renderRemote(WhitespaceLayout);

  await expect
    .poll(() => host.textContent, { timeout: 5000 })
    .toContain("5 pilots");
});
