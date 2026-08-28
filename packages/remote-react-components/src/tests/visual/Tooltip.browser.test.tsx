import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

/*
 * Opened through `isOpen` rather than by hovering the trigger.
 *
 * Hovering made this the only visual scenario whose subject the screenshot
 * preamble takes apart: parking the pointer un-hovers the trigger, and
 * react-aria then keeps the tooltip painted for `closeDelay` — 500ms. The
 * capture usually landed inside that window, so the scenario passed by
 * outrunning a timer it does not control, and the frame it lost in is a
 * tooltip-less one.
 *
 * #2945 lost it. `update-screenshots` runs the whole suite with `--update` and
 * commits everything, so a CodeBlock change committed that empty frame as the
 * `firefox-linux` baseline for `Tooltip - visible`, contradicting the three
 * beside it and keeping the scheduled run red in both environments.
 *
 * A controlled `isOpen` has no timer in it at all: the tooltip is open because
 * the test says so, and the pointer is irrelevant. The rendered output is
 * identical to what the three intact baselines already show — trigger in its
 * resting state, tooltip below it — so they stay valid.
 *
 * What this no longer covers is that hovering *opens* a tooltip. That is
 * behaviour, not appearance, and it belongs in a browser test rather than in a
 * screenshot that can only ever assert it by racing a delay.
 */

test.each(testEnvironments)(
  "Tooltip (%s)",
  async ({
    testScreenshot,
    render,
    components: { Tooltip, TooltipTrigger, Button },
  }) => {
    await render(
      <TooltipTrigger isOpen>
        <Button>Button</Button>
        <Tooltip>Tooltip</Tooltip>
      </TooltipTrigger>,
    );

    await testScreenshot("Tooltip - visible");
  },
);
