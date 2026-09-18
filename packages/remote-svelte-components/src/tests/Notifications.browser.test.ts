import { page } from "vitest/browser";
import { afterEach, expect, test } from "vitest";
import NotificationScenario from "./fixtures/NotificationScenario.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * The provider's own half: the notifications live in a reactive list in the
 * extension, and the host renders them in its own container. The container is
 * not part of the remote tree, so "it reached the host" is the only thing that
 * proves the round trip — the controller's rules are unit-tested next to it.
 */
afterEach(() => cleanupRemote());

/*
 * Read off the host's own node. The remote tree is mirrored into the same
 * document, so a text query matches the `flr-notification` as well and vitest's
 * strict mode fails on the pair.
 *
 * The host's notification container is portalled out of the host element, so
 * this looks at the document minus the remote app's hidden subtree.
 */
const hostNotifications = (remoteRoot: Element) =>
  [...document.querySelectorAll(".flow--notification")].filter(
    (element) => !remoteRoot.contains(element),
  );

test("a notification the app raises is rendered by the host", async () => {
  const { remote } = renderRemote(NotificationScenario);

  await page.getByRole("button", { name: "Send" }).click();

  await expect
    .poll(() => hostNotifications(remote).length, { timeout: 5000 })
    .toBe(1);
  expect(hostNotifications(remote)[0]?.textContent).toContain(
    "Rebel transmission",
  );
});

test("removing it takes it off the host again", async () => {
  const { remote } = renderRemote(NotificationScenario);

  await page.getByRole("button", { name: "Send" }).click();
  await expect
    .poll(() => hostNotifications(remote).length, { timeout: 5000 })
    .toBe(1);

  await page.getByRole("button", { name: "Dismiss" }).click();

  await expect
    .poll(() => hostNotifications(remote).length, { timeout: 5000 })
    .toBe(0);
});

/*
 * A snippet cannot be inspected, so `autoClose` is passed alongside it — where
 * React and Vue read it off the element they were handed. This is the test that
 * the option actually reaches the timer.
 */
test("an autoClose notification closes itself", async () => {
  const { remote } = renderRemote(NotificationScenario, { autoClose: true });

  await page.getByRole("button", { name: "Send" }).click();
  await expect
    .poll(() => hostNotifications(remote).length, { timeout: 5000 })
    .toBe(1);

  await expect
    .poll(() => hostNotifications(remote).length, { timeout: 15_000 })
    .toBe(0);
}, 30_000);
