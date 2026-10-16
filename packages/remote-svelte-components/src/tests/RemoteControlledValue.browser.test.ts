import { page, userEvent } from "vitest/browser";
import { afterEach, expect, test, vi } from "vitest";
import ControlledField from "./fixtures/ControlledField.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * The Svelte counterpart of the React package's test of the same name.
 *
 * A field the remote app controls reports every keystroke and gets the value
 * back a round trip later. The host must not apply that echo — it is already
 * showing the character, and an echo of an earlier keystroke would drop
 * everything typed since. The remote marks the echo
 * (`controlledRemoteValue.ts`) and the host renders its own mirror instead.
 *
 * A value the app sets itself carries no marker and has to arrive, or the app
 * could no longer drive its own field. Both directions are asserted, because
 * the marker is what separates them.
 */
afterEach(() => cleanupRemote());

const typedText = "correcthorsebattery";
const valueFromTheRemoteSide = "set by the remote app";

const input = () => page.getByRole("textbox", { name: "Passphrase" });

test("a field the remote app controls keeps everything typed into it", async () => {
  const onChange = vi.fn();

  renderRemote(ControlledField, { onChange, valueFromTheRemoteSide });
  await expect.element(input()).toBeVisible();

  await userEvent.type(input(), typedText);

  await expect.element(input()).toHaveValue(typedText);

  /*
   * Every keystroke reached the app, not just the ones that survived. A short
   * value in the field with a full count here would mean the echo won.
   */
  expect(onChange).toHaveBeenCalledTimes(typedText.length);
  expect(onChange).toHaveBeenLastCalledWith(typedText);
});

test("a value the remote app sets itself reaches the field", async () => {
  renderRemote(ControlledField, { valueFromTheRemoteSide });
  await expect.element(input()).toBeVisible();

  await userEvent.type(input(), "typed by hand");
  await page.getByRole("button", { name: "Overwrite" }).click();

  await expect
    .element(input(), { timeout: 5000 })
    .toHaveValue(valueFromTheRemoteSide);
});
