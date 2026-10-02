import { afterEach, expect, test } from "vitest";
import PropsContextScenario from "./fixtures/PropsContextScenario.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * Svelte's `setContext`/`getContext` is the same mechanism React's context is,
 * so unlike Vue's `cloneVNode` stand-in this reaches the whole subtree — and
 * that is exactly why the clearing matters. A generated component consumes its
 * entry and clears the context for its own children, the way every Flow
 * `flowComponent` of type `ui` wraps them in a `ClearPropsContext`. Without it a
 * `Modal`'s header styling would reach every `Heading` inside its content.
 */
afterEach(() => cleanupRemote());

const headings = (host: Element) => [
  ...host.querySelectorAll(".flow--heading"),
];

test("configures the components below it, and stops at the first that clears", async () => {
  const { host } = renderRemote(PropsContextScenario);

  await expect.poll(() => headings(host).length, { timeout: 5000 }).toBe(2);

  const [configured, cleared] = headings(host);

  expect(configured?.className).toContain("configured-by-the-context");
  expect(configured?.tagName).toBe("H4");

  expect(cleared?.className).not.toContain("configured-by-the-context");
  expect(cleared?.tagName).not.toBe("H4");
});
