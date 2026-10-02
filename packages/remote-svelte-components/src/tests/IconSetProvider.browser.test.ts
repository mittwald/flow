import { afterEach, expect, test } from "vitest";
import IconSetScenario from "./fixtures/IconSetScenario.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * The counterpart of React's `IconSetProvider`, which mStudio uses to swap the
 * default set for the FontAwesome Pro one. There is no pro set here, so what it
 * is for is an app bringing its own icons — and the contract is the same: a set
 * replaces the icons it names and nothing else, and the replacement is rendered
 * as `Icon`'s child, so it keeps Flow's sizing and classes.
 */
afterEach(() => cleanupRemote());

const icons = (host: Element) => [...host.querySelectorAll("svg")];

test("without a provider the icons come from Flow's own set", async () => {
  const { host } = renderRemote(IconSetScenario);

  await expect.poll(() => icons(host).length, { timeout: 5000 }).toBe(2);

  expect(icons(host)[0]?.getAttribute("class")).toContain(
    "tabler-icon-info-circle",
  );
  expect(host.querySelector(".app-own-icon")).toBeNull();
});

test("a set replaces the icons it names, and only those", async () => {
  const { host } = renderRemote(IconSetScenario, { replace: true });

  await expect.poll(() => icons(host).length, { timeout: 5000 }).toBe(2);

  const [replaced, untouched] = icons(host);

  expect(replaced?.getAttribute("class")).toContain("app-own-icon");
  expect(replaced?.getAttribute("class")).not.toContain("tabler-icon");

  /* `Star` was not in the set, so it is still Flow's. */
  expect(untouched?.getAttribute("class")).not.toContain("app-own-icon");
  expect(untouched?.getAttribute("viewBox")).toBe("0 0 21 20");
});

/*
 * The replacement goes through `Icon` like the built-in one — that is what
 * keeps `size`, `color` and the props context working on an app's own icon.
 */
test("Flow's icon styling keeps applying to the replacement", async () => {
  const { host } = renderRemote(IconSetScenario, { replace: true });

  await expect.poll(() => icons(host).length, { timeout: 5000 }).toBe(2);

  const replaced = icons(host)[0];

  expect(replaced?.getAttribute("class")).toContain("flow--icon");
  expect(replaced?.getAttribute("class")).toContain("flow--icon--size-s");
});
