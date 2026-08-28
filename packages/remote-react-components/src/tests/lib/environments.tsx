import RemoteRoot from "@/components/RemoteRoot";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { cleanup, render } from "vitest-browser-react";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import type { Locator, ScreenshotMatcherOptions } from "vitest/browser";
import * as RemoteComponents from "@/index";
import * as Components from "@mittwald/flow-react-components";
import * as PasswordToolsComponents from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { NotificationProvider } from "@mittwald/flow-react-components";
import { useMemo, type FC, type PropsWithChildren } from "react";
import { RootContainer, rootContainerLocator } from "@/tests/lib/RootContainer";
import { createSerializedReceiver } from "@/tests/lib/serializedConnection";
import { expect } from "vitest";

const localComponents: typeof Components & typeof PasswordToolsComponents = {
  ...Components,
  ...PasswordToolsComponents,
};

/*
 * <RemoteRenderer /> keeps the receiver itself, while <RemoteRoot /> talks to a
 * connection that routes every mutation through the real
 * FlowThreadSerialization (see `@/tests/lib/serializedConnection`) — which is
 * what production does, and what this environment used to skip. Handing
 * <RemoteRoot /> the receiver's live connection instead let props reach the host
 * as the very objects the test created, so a serializer that dropped half of
 * them still passed every scenario in this suite.
 */
const RemoteTestUi: FC<PropsWithChildren> = ({ children }) => {
  const receiver = useMemo(() => new RemoteReceiver(), []);
  const remoteReceiver = useMemo(
    () => createSerializedReceiver(receiver),
    [receiver],
  );

  return (
    <RootContainer>
      <RemoteRenderer __remoteReceiver={receiver} />
      <RemoteRoot __remoteReceiver={remoteReceiver}>
        <NotificationProvider>{children}</NotificationProvider>
      </RemoteRoot>
    </RootContainer>
  );
};

export const renderRemote: typeof render = async (ui, options) => {
  await cleanup();
  const result = await render(<RemoteTestUi>{ui}</RemoteTestUi>, options);
  await setNeutralPointerPosition();
  return result;
};

export const renderLocal: typeof render = async (ui, options) => {
  await cleanup();
  const result = await render(<RootContainer>{ui}</RootContainer>, options);
  await setNeutralPointerPosition();
  return result;
};

/*
 * Parks the pointer where it cannot put anything into its hover state: inside
 * the container's 32px padding, which no scenario paints into.
 *
 * Not `unhover()`, which is implemented as "hover `html > body`" — and hovering
 * targets an element's centre, so it parked the pointer in the middle of the
 * viewport, where scenarios put their content. It produced the exact hover state
 * it is named after preventing.
 *
 * `force` skips the hit-target check. Where a full-screen overlay is open there
 * is no free point in the viewport at all, and the pointer landing on a backdrop
 * is harmless — the only thing that matters is that it is off the components.
 */
const setNeutralPointerPosition = async () => {
  await rootContainerLocator.hover({
    position: { x: 4, y: 4 },
    force: true,
  });
  rootContainerLocator.element().focus();
};

/*
 * An element counts as painted when it occupies space and is not hidden. Both
 * environments mirror the remote tree through a 0x0, `visibility: hidden`
 * wrapper whose children can still report a non-empty box, so the computed
 * style is what separates real output from that mirror.
 */
const isPainted = (element: Element): boolean => {
  const { width, height } = element.getBoundingClientRect();
  if (width === 0 || height === 0) {
    return false;
  }
  const { display, visibility } = getComputedStyle(element);
  return display !== "none" && visibility !== "hidden";
};

/*
 * `toMatchScreenshot` decides the page is ready by taking two screenshots back
 * to back and comparing them — two identical frames count as "stable". A
 * container that has not painted its content yet is trivially stable, because
 * two blank frames are identical, so the matcher returns the blank frame. With
 * `--update` that frame is written to disk as the new reference and nothing
 * fails, which is how blank snapshots end up committed.
 *
 * The Remote environment enters that window on every render: `render()` resolves
 * before <RemoteRenderer /> has materialised the host tree, because it
 * lazy-imports RemoteRendererBrowser and mounts only after `useIsMounted()`
 * flips. Measured at ~25ms — short enough that both screenshots regularly land
 * inside it, and load-dependent enough to look random per scenario.
 *
 * So gate the screenshot on content actually being painted instead of trusting
 * pixel stability. A scenario that never paints fails here with this message
 * rather than silently producing an empty reference.
 */
const waitForPaintedContent = async (): Promise<void> => {
  await expect
    .poll(
      () =>
        Array.from(rootContainerLocator.element().querySelectorAll("*")).some(
          isPainted,
        ),
      {
        /*
         * The wait itself costs nothing once content is there — polling stops on
         * the first painted frame, ~25ms in. The budget only bounds the failure
         * case, so keep it well above `expect.poll`'s 1s default: a heavy
         * scenario on a loaded machine would otherwise fail here for being slow
         * rather than for being blank.
         */
        timeout: 5000,
        message:
          "The root container never painted any content, so the screenshot would have captured a blank frame.",
      },
    )
    .toBe(true);
};

/*
 * Waits until the document has stopped mutating, so the pointer park below
 * cannot land in the middle of a render.
 *
 * `Remote` applies an interaction a round trip late: a key press updates the
 * remote tree, which serializes mutations the host applies a tick later. Parking
 * the pointer inside that window silently breaks keyboard focus rings.
 * `hover()` emits a `pointermove`, and react-aria takes any pointer event as the
 * current interaction modality — but only `pointerdown`/`mousedown` notify its
 * subscribers, so nothing re-renders and elements already carrying
 * `data-focus-visible` keep it. The pending remote render then lands, recomputes
 * `isFocusVisible()` against the now-`pointer` modality, and drops the
 * attribute. The focus ring vanishes from the screenshot — in `Remote` only,
 * because `Local` renders synchronously, before the pointer ever moves.
 *
 * That produced a ~1% diff against a reference both environments share, on every
 * scenario whose last act is a keyboard press (#2981). Going quiet first gives
 * `Remote` the ordering `Local` already has: last render, then pointer.
 *
 * Observes the whole document, not the container: overlays render in portals
 * outside it, and the remote tree's own mirror — whose mutations are exactly
 * what has to settle — lives outside it too.
 */
const settleQuietFor = 100;
const settleTimeout = 2000;

const waitForSettledContent = async (): Promise<void> =>
  new Promise<void>((resolve) => {
    let quiet: ReturnType<typeof setTimeout>;

    const observer = new MutationObserver(() => {
      clearTimeout(quiet);
      quiet = setTimeout(finish, settleQuietFor);
    });

    /*
     * A scenario that never goes quiet (an animation the reduced-motion setting
     * does not cover) must not fail here — the screenshot matcher is the one
     * that gets to judge stability. So cap the wait and carry on.
     */
    const deadline = setTimeout(finish, settleTimeout);

    function finish() {
      clearTimeout(quiet);
      clearTimeout(deadline);
      observer.disconnect();
      resolve();
    }

    quiet = setTimeout(finish, settleQuietFor);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
  });

export interface TestScreenshotOptions extends ScreenshotMatcherOptions {
  /**
   * Leaves the pointer where the scenario put it, instead of parking it.
   *
   * For a scenario whose subject _is_ a hover state, parking the pointer
   * dismantles what the screenshot is meant to show. The tooltip scenario only
   * ever passed by outrunning react-aria's `closeDelay` — 500ms during which a
   * tooltip stays painted after the pointer leaves its trigger. That is a race
   * the capture usually wins and sometimes doesn't, and the frame it loses in
   * is a tooltip-less one. #2945 regenerated screenshots for an unrelated
   * CodeBlock change, caught that frame, and committed it as the
   * `firefox-linux` baseline for `Tooltip - visible` — leaving it contradicting
   * the three baselines beside it, and the scheduled visual run red in both
   * environments.
   *
   * A scenario that keeps the pointer on its trigger has no such window. The
   * cost is that the trigger is captured in its hover state, which is honest:
   * that is what the user sees when a tooltip is open.
   */
  keepPointerPosition?: boolean;
}

/**
 * Everything `testScreenshot` does before it captures. Exported so a scenario's
 * state at capture time can be asserted on the DOM instead of on pixels — see
 * `ScreenshotPreamble.browser.test.tsx`.
 */
export const prepareForScreenshot = async ({
  keepPointerPosition = false,
}: Pick<TestScreenshotOptions, "keepPointerPosition"> = {}): Promise<void> => {
  await waitForPaintedContent();
  await waitForSettledContent();

  if (!keepPointerPosition) {
    await setNeutralPointerPosition();
  }
};

const testScreenshot = async (
  description: string,
  { keepPointerPosition = false, ...options }: TestScreenshotOptions = {},
): Promise<void> => {
  await prepareForScreenshot({ keepPointerPosition });
  await expect(rootContainerLocator).toMatchScreenshot(description, options);
};

interface TestEnvironment {
  toString: () => string;
  components: typeof localComponents | typeof RemoteComponents;
  render: typeof render;
  container: Locator;
  testScreenshot: (
    description: string,
    options?: TestScreenshotOptions,
  ) => Promise<void>;
}

const remoteTestEnvironment: TestEnvironment = {
  toString: () => "Remote",
  components: RemoteComponents,
  render: renderRemote,
  container: rootContainerLocator,
  testScreenshot,
};

const localTestEnvironment: TestEnvironment = {
  toString: () => "Local",
  components: localComponents,
  render: renderLocal,
  container: rootContainerLocator,
  testScreenshot,
};

export const testEnvironments = [
  localTestEnvironment,
  remoteTestEnvironment,
] as const;

export interface CrossVersionSkip {
  /** Skip when the tested version is older than this (semver). */
  below?: string;
  /** Skip these exact versions (for non-monotonic breakage). */
  exclude?: string[];
}

/**
 * Skip predicate for the cross-version harness (see
 * e2e/cross-version-inprocess). In the normal visual suite there is no old
 * version, so this is always `false` and every test runs. The cross-version
 * harness replaces this module with its own implementation that skips tests
 * whose component/output didn't yet exist in the tested version.
 */
export const crossVersion = (ignoredOptions: CrossVersionSkip): boolean =>
  false;
