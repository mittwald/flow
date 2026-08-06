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
import { expect } from "vitest";

const localComponents: typeof Components & typeof PasswordToolsComponents = {
  ...Components,
  ...PasswordToolsComponents,
};

const RemoteTestUi: FC<PropsWithChildren> = ({ children }) => {
  const receiver = useMemo(() => new RemoteReceiver(), []);

  return (
    <RootContainer>
      <RemoteRenderer __remoteReceiver={receiver} />
      <RemoteRoot __remoteReceiver={receiver}>
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

const testScreenshot = async (
  description: string,
  options: ScreenshotMatcherOptions = {},
): Promise<void> => {
  await waitForPaintedContent();
  await setNeutralPointerPosition();
  await expect(rootContainerLocator).toMatchScreenshot(description, options);
};

interface TestEnvironment {
  toString: () => string;
  components: typeof localComponents | typeof RemoteComponents;
  render: typeof render;
  container: Locator;
  testScreenshot: (
    description: string,
    options?: ScreenshotMatcherOptions,
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
