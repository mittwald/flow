import { Button } from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page } from "vitest/browser";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

/*
 * Vue folds `Once`, `Capture` and `Passive` into the v-on key of a component:
 * `@press.once` reaches the wrapper as `onPressOnce`. No element has an event
 * by that name, so the key used to fall through and land on the element as an
 * attribute holding the handler's source.
 */
afterEach(() => {
  cleanupRemote();
  vi.restoreAllMocks();
});

/* The round trip has landed once the label shows the count. */
const pressTwice = async () => {
  const button = page.getByRole("button");
  await button.click();
  await expect.element(button).toHaveTextContent("1");
  await button.click();
  await expect.element(button).toHaveTextContent("2");
};

test("@press.once calls its handler on the first press only", async () => {
  const once = vi.fn();
  const presses = ref(0);

  renderRemote(
    defineComponent(
      () => () =>
        h(
          Button,
          {
            /* What a template compiles `@press.once="once"` to. */
            onPressOnce: once,
            onPress: () => presses.value++,
          } as never,
          () => String(presses.value),
        ),
    ),
  );

  await pressTwice();

  expect(once).toHaveBeenCalledOnce();
  expect(
    document.querySelector("flr-button")?.hasAttribute("onPressOnce"),
  ).toBe(false);
});

test("@press.capture warns and calls its handler as @press would", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const presses = ref(0);

  renderRemote(
    defineComponent(
      () => () =>
        h(Button, { onPressCapture: () => presses.value++ } as never, () =>
          String(presses.value),
        ),
    ),
  );

  await pressTwice();

  expect(
    warn.mock.calls.filter(([message]) =>
      String(message).includes("@press.capture on <Button>"),
    ),
  ).toHaveLength(1);
});

test("a handler for an event the element lacks is dropped, not stringified", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

  renderRemote(
    defineComponent(
      () => () =>
        h(Button, { onLaunch: () => undefined } as never, () => "Launch"),
    ),
  );

  await expect.element(page.getByRole("button")).toBeVisible();
  const element = document.querySelector("flr-button");
  expect(element?.getAttributeNames().filter((n) => /launch/i.test(n))).toEqual(
    [],
  );
  expect(warn).toHaveBeenCalledWith(
    "[flow] <Button> has no event for onLaunch; the handler is dropped.",
  );
});
