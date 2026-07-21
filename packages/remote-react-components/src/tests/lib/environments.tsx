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

const setNeutralPointerPosition = async () => {
  await rootContainerLocator.unhover();
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
