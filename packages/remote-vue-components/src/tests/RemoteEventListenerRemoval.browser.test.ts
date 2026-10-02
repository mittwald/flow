import { Button } from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page } from "vitest/browser";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

/*
 * The Vue counterpart of the React package's test of the same name.
 *
 * Removing an event listener from a remote element used to leave a handler
 * behind that throws when the user triggers it: the remote deletes the key but
 * sends the removal as a plain update, so on the host the key survives holding
 * `undefined`, and the host wraps every entry into a handler unguarded.
 *
 * This factory has a second way to reach the same place. It keeps the one
 * listener it attached per event, because `FlowRemoteElement` keys its own map
 * on the function it was handed — pass back the wrong reference and the
 * removal silently does nothing, leaving the old handler live on an element
 * whose props have moved on.
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
   * An inline handler is a new function on every render. The listener has to
   * call the latest one, and only it — a stale one records the first round
   * twice.
   */
  expect(pressed).toEqual(["round 1", "round 2"]);
});

/*
 * `cloneVNode` and Vue's `mergeProps` combine two handlers for one event into an
 * array, which is how a composite adds its handler to one the author wrote.
 */
test("runs every handler of a merged list, in order", async () => {
  const pressed: string[] = [];

  renderRemote(
    defineComponent(
      () => () =>
        h(
          Button,
          {
            /* What `mergeProps` produces; the prop type has no array form. */
            onPress: [
              () => pressed.push("first"),
              [() => pressed.push("second")],
            ] as never,
          },
          () => "Fire",
        ),
    ),
  );

  await page.getByRole("button", { name: "Fire" }).click();

  await vi.waitFor(() => expect(pressed).toEqual(["first", "second"]));
});
