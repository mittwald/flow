import { Button, Label, TextField } from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page, userEvent } from "vitest/browser";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

/*
 * The Vue counterpart of the React package's test of the same name.
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

const controlledField = (onChange?: (value: string) => void) =>
  defineComponent(() => {
    const value = ref("");
    return () => [
      h(
        TextField,
        {
          value: value.value,
          onChange: (next: string) => {
            value.value = next;
            onChange?.(next);
          },
        },
        () => h(Label, null, () => "Passphrase"),
      ),
      h(
        Button,
        { onPress: () => (value.value = valueFromTheRemoteSide) },
        () => "Overwrite",
      ),
    ];
  });

const input = () => page.getByRole("textbox", { name: "Passphrase" });

test("a field the remote app controls keeps everything typed into it", async () => {
  const onChange = vi.fn();

  renderRemote(controlledField(onChange));
  await expect.element(input()).toBeVisible();

  await userEvent.type(input(), typedText);

  await expect.element(input()).toHaveValue(typedText);

  /*
   * Every reported change carries the whole text, so an echo the host applied
   * would show up as a value that is not a prefix of what was typed. The remote
   * side does not necessarily see every keystroke — a host event that fires
   * while a remote render is in flight is dropped, which is load-dependent and
   * has nothing to do with the echo.
   */
  for (const [reportedValue] of onChange.mock.calls) {
    expect(typedText.startsWith(reportedValue as string)).toBe(true);
  }
});

test("a value the remote app sets reaches the field", async () => {
  renderRemote(controlledField());
  await expect.element(input()).toBeVisible();

  await userEvent.type(input(), typedText);
  await expect.element(input()).toHaveValue(typedText);

  await page.getByRole("button", { name: "Overwrite" }).click();

  await expect.element(input()).toHaveValue(valueFromTheRemoteSide);
});

test("a controlled field does not switch between controlled and uncontrolled", async () => {
  const warn = vi.spyOn(console, "warn");
  const error = vi.spyOn(console, "error");

  try {
    renderRemote(controlledField());
    await expect.element(input()).toBeVisible();

    await userEvent.type(input(), typedText);
    await expect.element(input()).toHaveValue(typedText);

    const messages = [...warn.mock.calls, ...error.mock.calls]
      .flat()
      .join("\n");

    for (const warning of [
      "uncontrolled to controlled",
      "controlled to uncontrolled",
      "uncontrolled input to be controlled",
      "controlled input to be uncontrolled",
    ]) {
      expect(messages).not.toContain(warning);
    }
  } finally {
    warn.mockRestore();
    error.mockRestore();
  }
});
