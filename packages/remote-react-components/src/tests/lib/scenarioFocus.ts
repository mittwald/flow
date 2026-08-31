import { rootContainerLocator } from "@/tests/lib/RootContainer";
import { expect } from "vitest";

/*
 * Synchronizing a visual scenario on the FOCUS — the one thing the screenshot
 * preamble cannot do for you.
 *
 * `prepareForScreenshot` (see `@/tests/lib/environments`) waits for the document
 * to stop MUTATING. A focus move is not a mutation: `:focus` and `:focus-within`
 * are pseudo-classes, so nothing the MutationObserver watches changes, and a
 * react-aria focus restore fired by an unmounting popover lands after the quiet
 * window anyway.
 *
 * So reach for these helpers whenever a scenario's next step or its capture
 * depends on where the focus sits:
 *
 * - **A step that closes an overlay** — Escape, Enter on a calendar cell, a
 *   click on a menu item. react-aria restores the focus to the trigger while the
 *   popover unmounts, asynchronously. A key press sent into that window is
 *   undone by the restore landing after it, and the scenario continues from a
 *   state it never asked for.
 * - **A capture whose reference encodes a focus ring** — or the absence of one.
 *
 * Losing the race costs a ~1% diff in whichever environment lost it. Both
 * environments share one reference, so it reads as a random per-run failure
 * rather than as a race — and it is not one a bigger sleep fixes.
 *
 * `Local` renders synchronously and usually wins these races; `Remote` applies
 * every interaction a serializer round trip late. A scenario passing in `Local`
 * therefore says nothing about `Remote`.
 *
 * A plain `click()` or `fill()` needs no wait — the locator action resolves after
 * the browser has moved the focus.
 */

/**
 * Whether the focus sits in the scenario at all, i.e. inside the container the
 * visual suite renders into and captures.
 *
 * A field's focus ring is pure CSS (`:focus-within` on the form control,
 * `:focus` on a segment), so this is exactly what the reference encodes.
 * Popovers render in a portal outside the container, so an open one holding the
 * focus reads as `false`.
 */
export const focusIsInTheScenario = (): boolean =>
  rootContainerLocator.element().contains(document.activeElement);

/*
 * The move being waited for is a single tick in `Local`; `Remote` adds a
 * serializer round trip, and CI hardware is slower again. Same scale as the
 * preamble's `settleTimeout`, and far below the project's 60s `testTimeout` — so
 * a scenario that never gets there fails with the message below instead of
 * timing out anonymously.
 */
const focusTimeout = 2000;

/** Waits until the focus has (re-)entered the scenario. */
export const waitForFocusInTheScenario = async (): Promise<void> => {
  await expect
    .poll(focusIsInTheScenario, {
      timeout: focusTimeout,
      message:
        "The focus never entered the scenario, so the capture would have shown an unfocused component.",
    })
    .toBe(true);
};

/** Waits until the focus has left the scenario. */
export const waitForFocusOutsideTheScenario = async (): Promise<void> => {
  await expect
    .poll(focusIsInTheScenario, {
      timeout: focusTimeout,
      message:
        "The focus never left the scenario, so the capture would have shown a focused component.",
    })
    .toBe(false);
};
