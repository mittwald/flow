import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { useState, type FC } from "react";

/*
 * Removing an event listener from a remote element left a handler behind that
 * throws when the user triggers it.
 *
 * The two sides disagree on what removal means. The remote element deletes the
 * key (`updateRemoteElementEventListener` in remote-dom-core) but sends the
 * removal as a plain update, and `RemoteReceiver.updateProperty` applies it as
 * `updateObject[property] = value` — so on the host the key survives holding
 * `undefined`. The host's `usePropsForRemoteElement` then walks
 * `Object.entries(eventListeners)` and wraps every entry, unguarded, unlike its
 * `eventProps` branch, which skips a falsy listener. The wrapper is a function,
 * so nothing looks wrong until it runs: `TypeError: listener is not a function`,
 * raised out of React's event dispatch and therefore unhandled.
 *
 * `Local` never sees it — an absent `onPress` prop is simply absent.
 *
 * It is not limited to a handler a component drops for good. Every re-render
 * with an inline handler removes and re-adds it, each in its own `mutate()`
 * call, so the host renders once with the key already emptied and the new
 * listener not yet applied. An event arriving in that window hits the same
 * wrapper. That is how the visual suite kept failing its whole run over an
 * unhandled error while every test passed.
 */

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

test.each(testEnvironments)(
  "a button whose press handler was removed stays clickable (%s)",
  async ({ render, components: { Button } }) => {
    const Wrapper: FC = () => {
      const [handled, setHandled] = useState(true);
      return (
        <Button onPress={handled ? () => setHandled(false) : undefined}>
          {handled ? "Handled" : "Unhandled"}
        </Button>
      );
    };

    await render(<Wrapper />);

    const button = page.getByRole("button");
    await button.click();

    /*
     * The label rides along with the removal in the same render, so `Remote`
     * showing it means the round trip has landed. Clicking earlier would only
     * exercise the old listener.
     *
     * Asserted on the button, not with `getByText`: `Remote` keeps a hidden
     * mirror of the remote tree in the same document, so the label exists twice
     * while the host tree catches up and a text query hits both.
     */
    await expect
      .element(button, { timeout: 5000 })
      .toHaveTextContent("Unhandled");

    const errors = await errorsDuring(async () => {
      await button.click();
    });

    expect(
      errors,
      "Pressing the button raised an error. The removed listener left a key on `eventListeners` holding `undefined`, and the host wrapped it into a handler that throws — see the comment at the top of this file.",
    ).toEqual([]);
  },
);
