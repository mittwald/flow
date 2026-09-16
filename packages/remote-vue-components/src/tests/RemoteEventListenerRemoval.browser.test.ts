import { Button } from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page } from "vitest/browser";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

/*
 * The Vue counterpart of the React package's test of the same name.
 *
 * Removing an event listener from a remote element used to leave a handler
 * behind that throws when the user triggers it: the remote deletes the key but
 * sends the removal as a plain update, so on the host the key survives holding
 * `undefined`, and the host wraps every entry into a handler unguarded.
 *
 * This factory has a second way to reach the same place. It keeps the listener
 * it attached next to the one the template supplied, because
 * `FlowRemoteElement` keys its own map on the function it was handed — pass
 * back the wrong reference and the removal silently does nothing, leaving the
 * old handler live on an element whose props have moved on.
 */
afterEach(() => cleanupRemote());

const errorsDuring = async (act: () => Promise<void>): Promise<string[]> => {
  const errors: string[] = [];
  const collect = (event: ErrorEvent) => errors.push(event.message);
  window.addEventListener("error", collect);
  try {
    await act();
  } finally {
    window.removeEventListener("error", collect);
  }
  return errors;
};

test("a button whose press handler was removed stays clickable", async () => {
  const Wrapper = defineComponent(() => {
    const handled = ref(true);
    return () =>
      h(
        Button,
        { onPress: handled.value ? () => (handled.value = false) : undefined },
        () => (handled.value ? "Handled" : "Unhandled"),
      );
  });

  renderRemote(Wrapper);

  const button = page.getByRole("button");
  await button.click();

  /*
   * The label rides along with the removal in the same render, so seeing it
   * means the round trip has landed. Clicking earlier would only exercise the
   * old listener. Asserted on the button rather than by text: the remote tree
   * is mirrored into the same document, so the label exists twice.
   */
  await expect
    .element(button, { timeout: 5000 })
    .toHaveTextContent("Unhandled");

  const errors = await errorsDuring(() => button.click());

  expect(
    errors,
    "Pressing the button raised an error. A removed listener left a handler behind — see the comment at the top of this file.",
  ).toEqual([]);
});

test("a handler replaced between renders is the one that runs", async () => {
  const pressed: string[] = [];

  const Wrapper = defineComponent(() => {
    const round = ref(1);
    return () =>
      h(
        Button,
        {
          onPress: () => {
            pressed.push(`round ${round.value}`);
            round.value++;
          },
        },
        () => `Round ${round.value}`,
      );
  });

  renderRemote(Wrapper);

  const button = page.getByRole("button");
  await button.click();
  await expect.element(button, { timeout: 5000 }).toHaveTextContent("Round 2");

  await button.click();
  await expect.element(button, { timeout: 5000 }).toHaveTextContent("Round 3");

  /*
   * An inline handler is a new function on every render, so each render removes
   * one listener and adds another. If the removal missed, the first handler
   * would still be attached and the first round would be recorded twice.
   */
  expect(pressed).toEqual(["round 1", "round 2"]);
});
