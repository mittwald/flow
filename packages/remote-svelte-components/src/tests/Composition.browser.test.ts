import { afterEach, describe, expect, test } from "vitest";
import BrowserOnlyScenario from "./fixtures/BrowserOnlyScenario.svelte";
import IntlProviderScenario from "./fixtures/IntlProviderScenario.svelte";
import WrapScenario from "./fixtures/WrapScenario.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * The three components that render no element of their own. Each one is two
 * lines, and each one is only observable through what does or does not reach
 * the host.
 */
afterEach(() => cleanupRemote());

describe("Wrap", () => {
  /*
   * React's `Wrap` takes the wrapper as a child and reaches into it. A snippet
   * cannot be reached into, so this one takes the wrapper as a snippet that
   * receives the content — a different signature for the same purpose, and the
   * reason it is worth a test of its own.
   */
  test("renders the wrapper around the content when the condition holds", async () => {
    const { host } = renderRemote(WrapScenario, { wrapped: true });

    await expect
      .poll(() => host.textContent, { timeout: 5000 })
      .toContain("Squadron");
    expect(host.querySelector(".flow--accent-box")).not.toBeNull();
  });

  test("renders the content bare when it does not", async () => {
    const { host } = renderRemote(WrapScenario, { wrapped: false });

    await expect
      .poll(() => host.textContent, { timeout: 5000 })
      .toContain("Squadron");
    expect(host.querySelector(".flow--accent-box")).toBeNull();
  });
});

describe("BrowserOnly", () => {
  test("renders its children once mounted", async () => {
    const { host } = renderRemote(BrowserOnlyScenario);

    await expect
      .poll(() => host.textContent, { timeout: 5000 })
      .toContain("Mounted on the client");
  });
});

describe("IntlProvider", () => {
  /*
   * It renders its children and nothing else — see the component. The test is
   * here so "nothing else" stays true: a provider that swallowed its children,
   * or wrapped them in an element, would be a silent difference from React.
   */
  test("passes its children through untouched", async () => {
    const { host } = renderRemote(IntlProviderScenario);

    await expect
      .poll(() => host.textContent, { timeout: 5000 })
      .toContain("Children reach the host");
    expect(host.children).toHaveLength(1);
  });
});
