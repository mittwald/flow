import RemoteRoot from "@/components/RemoteRoot";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { cleanup, render } from "vitest-browser-react";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import type { Locator, ScreenshotMatcherOptions } from "vitest/browser";
import * as RemoteComponents from "@/index";
import * as Components from "@mittwald/flow-react-components";
import * as PasswordToolsComponents from "@mittwald/flow-react-components/password-tools";
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

const testScreenshot = async (
  description: string,
  options: ScreenshotMatcherOptions = {},
): Promise<void> => {
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
