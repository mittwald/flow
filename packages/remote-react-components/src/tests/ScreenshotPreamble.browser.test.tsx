import { prepareForScreenshot, renderLocal } from "@/tests/lib/environments";
import { rootContainerLocator } from "@/tests/lib/RootContainer";
import { expect, test } from "vitest";

/*
 * `prepareForScreenshot` must not park the pointer while a render is still in
 * flight — the regression behind the `List items` and `List date range filter`
 * diffs in #2981.
 *
 * Parking the pointer calls `hover()`, which emits a `pointermove`, and
 * react-aria takes any pointer event as the current interaction modality. Only
 * `pointerdown`/`mousedown` notify its subscribers, so nothing re-renders and
 * elements already carrying `data-focus-visible` keep it. A render that lands
 * *after* that point recomputes `isFocusVisible()` against the now-`pointer`
 * modality and drops the attribute — the keyboard focus ring disappears from the
 * screenshot.
 *
 * `Remote` walks into that on keyboard interactions, because it applies the
 * resulting state a thread round trip late; `Local` renders synchronously,
 * before the pointer ever moves, and never noticed. Both environments pass the
 * same description to `testScreenshot` and therefore share one reference file,
 * so the divergence surfaced as a ~1% pixel diff in the one browser that renders
 * the dark theme.
 *
 * Asserted here as the ordering rule itself rather than through a scenario. A
 * scenario only reproduces the bug while its round trip happens to outlast the
 * pointer park: three variants of that test passed with the fix reverted —
 * silently guarding nothing — before this one replaced them. The focus ring in
 * the real output stays covered by the visual suite, which is what caught it.
 *
 * The bound this documents is real: the settle wait extends only for mutations
 * that arrive *inside* its quiet window, so it covers work that is continuously
 * in flight, not a render scheduled after an arbitrary idle gap.
 */

/** Comfortably inside `waitForSettledContent`'s quiet window. */
const pendingRenderDelay = 25;

test("the screenshot preamble waits for a render still in flight", async () => {
  await renderLocal(<span>content</span>);

  const container = rootContainerLocator.element();
  let landed = false;

  /*
   * Stands in for the mutation the host applies when a remote round trip
   * completes. The preamble has no way to know one is coming — only that the
   * document is still changing.
   */
  setTimeout(() => {
    container.append(document.createElement("span"));
    landed = true;
  }, pendingRenderDelay);

  await prepareForScreenshot();

  expect(
    landed,
    "The screenshot preamble returned while a render was still pending, so it would park the pointer mid-update — which strips `data-focus-visible` off anything the scenario focused by keyboard. See the comment at the top of this file.",
  ).toBe(true);
});
