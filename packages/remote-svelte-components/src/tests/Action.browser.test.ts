import { page } from "vitest/browser";
import { afterEach, describe, expect, test, vi } from "vitest";
import ActionInModal from "./fixtures/ActionInModal.svelte";
import ActionScenario from "./fixtures/ActionScenario.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * `Action` is the one rebuild with state of its own: it runs something, reports
 * how it went on the `Button` below it, and closes the overlay around it. Flow's
 * version is a MobX model; this one is three rune flags and a props context, and
 * every one of those three is asserted here — the states only exist on the host,
 * so a flag that never crosses is invisible in the extension.
 */
afterEach(() => cleanupRemote());

const button = () => page.getByRole("button", { name: "Run" });

/*
 * The states are classes on the host's button (`Button.module.scss`), not
 * attributes — `flow--button--is-pending` and friends.
 */
const buttonHasState = (state: "pending" | "succeeded" | "failed") =>
  button().element().classList.contains(`flow--button--is-${state}`);

describe("Action", () => {
  test("drives the button's pending state while it runs", async () => {
    let finish: () => void = () => undefined;
    const onAction = () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      });

    renderRemote(ActionScenario, { onAction });
    await expect.element(button()).toBeVisible();

    await button().click();

    await expect
      .poll(() => buttonHasState("pending"), { timeout: 5000 })
      .toBe(true);

    finish();

    await expect
      .poll(() => buttonHasState("pending"), { timeout: 5000 })
      .toBe(false);
  });

  /*
   * Only an action that ran can have succeeded. The state is the extension's,
   * not the host's — the host renders whatever the flag says, so it has to be
   * taken back here or the button stays green.
   */
  test("shows success for the duration it was given, then takes it back", async () => {
    renderRemote(ActionScenario, {
      onAction: () => undefined,
      successDuration: 300,
    });
    await expect.element(button()).toBeVisible();

    await button().click();

    await expect
      .poll(() => buttonHasState("succeeded"), { timeout: 5000 })
      .toBe(true);

    await expect
      .poll(() => buttonHasState("succeeded"), { timeout: 5000 })
      .toBe(false);
  });

  /*
   * Reported, not rethrown: the call arrives from a host event listener, so a
   * rethrow becomes an unhandled rejection the app cannot catch — and the
   * button's failed state is the feedback that was asked for.
   */
  test("reports a failure on the button instead of throwing", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    renderRemote(ActionScenario, {
      onAction: () => {
        throw new Error("Hyperdrive malfunction");
      },
    });
    await expect.element(button()).toBeVisible();

    await button().click();

    await expect
      .poll(() => buttonHasState("failed"), { timeout: 5000 })
      .toBe(true);

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  test("closes the overlay around it", async () => {
    const onAction = vi.fn();

    renderRemote(ActionInModal, { onAction });

    await page.getByRole("button", { name: "Open" }).click();
    await expect.element(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: "Confirm" }).click();

    await vi.waitFor(() => expect(onAction).toHaveBeenCalledTimes(1));
    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  });
});
