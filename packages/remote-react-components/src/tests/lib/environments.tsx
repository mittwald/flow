import RemoteRoot from "@/components/RemoteRoot";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { cleanup, render } from "vitest-browser-react";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import type { Locator, ScreenshotMatcherOptions } from "vitest/browser";
import * as RemoteComponents from "@/index";
import * as Components from "@mittwald/flow-react-components";
import { NotificationProvider } from "@mittwald/flow-react-components";
import { useMemo, type FC, type PropsWithChildren } from "react";
import { RootContainer, rootContainerLocator } from "@/tests/lib/RootContainer";
import { expect } from "vitest";

const RemoteTestUi: FC<PropsWithChildren> = (props) => {
  const receiver = useMemo(() => new RemoteReceiver(), []);

  return (
    <RootContainer>
      <RemoteRenderer __remoteReceiver={receiver} />
      <RemoteRoot __remoteReceiver={receiver}>
        <NotificationProvider>{props.children}</NotificationProvider>
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

interface TestEnvironement {
  toString: () => string;
  components: typeof Components | typeof RemoteComponents;
  render: typeof render;
  container: Locator;
  testScreenshot: (
    description: string,
    options?: ScreenshotMatcherOptions,
  ) => Promise<void>;
}

const remoteTestEnvironement: TestEnvironement = {
  toString: () => "Remote",
  components: RemoteComponents,
  render: renderRemote,
  container: rootContainerLocator,
  testScreenshot,
};

const localTestEnvironement: TestEnvironement = {
  toString: () => "Local",
  components: Components,
  render: renderLocal,
  container: rootContainerLocator,
  testScreenshot,
};

export const testEnvironments = [
  localTestEnvironement,
  remoteTestEnvironement,
] as const;
