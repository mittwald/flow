import RemoteRoot from "@/components/RemoteRoot";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { render } from "vitest-browser-react";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import type { Locator, ScreenshotMatcherOptions } from "vitest/browser";
import * as RemoteComponents from "@/index";
import * as Components from "@mittwald/flow-react-components";
import { NotificationProvider } from "@mittwald/flow-react-components";
import { useMemo, type FC, type PropsWithChildren } from "react";
import { RootContainer, rootContainerLocator } from "@/tests/lib/RootContainer";
import { sleep } from "@/tests/lib/sleep";
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
  const result = await render(<RemoteTestUi>{ui}</RemoteTestUi>, options);
  await prepareTesting();
  return result;
};

export const renderLocal: typeof render = async (ui, options) => {
  const result = await render(<RootContainer>{ui}</RootContainer>, options);
  await prepareTesting();
  return result;
};

const prepareTesting = async () => {
  // Move the mouse to somewhere neutral to avoid hover effects
  await rootContainerLocator.unhover();
  await prepareScreenshot();
};

const prepareScreenshot = async (): Promise<void> => {
  await sleep(25);
};

const testScreenshot = async (
  description: string,
  options?: ScreenshotMatcherOptions,
): Promise<void> => {
  await prepareScreenshot();
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
